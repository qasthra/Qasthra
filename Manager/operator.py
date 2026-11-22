# Manager/operator.py  --  QASTHRA command tool (Termux)
# Run:  python Manager/operator.py            (interactive)
#       python Manager/operator.py "/find(script.js|menu)"
#       python Manager/operator.py "/auto(1)"  (run planner, all-or-nothing)
#       python Manager/operator.py "/status"   (is the current planner applied?)
#       python Manager/operator.py "/help"     (list every command)
#
# NOTE: this file is named like a Python stdlib module. The next two lines
# stop Python from importing THIS file by mistake. Do not move them.
import sys
sys.path = [p for p in sys.path if p not in ("", os_dir := __import__("os").path.dirname(__import__("os").path.abspath(__file__)))]

import contextlib
import io
import os
import re
import shutil
import time
from datetime import datetime

MANAGER = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(MANAGER)
MEMORY = os.path.join(MANAGER, "memory.txt")
PLANNER = os.path.join(MANAGER, "planner.txt")
MATERIALS = os.path.join(ROOT, "Materials")
FOLDERS = {"backup": "Backups", "chunk": "Chunks", "proto": "Prototypes"}
TYPES = {".html": "HTML", ".css": "CSS", ".js": "JS"}
SKIP_DIRS = {"Materials", "Manager", "Sources", ".git"}
CHUNK_SIZE = 100
MUTATING = {"replace", "append", "delete", "proto"}
BARE = {"status", "help"}      # commands that work without (...)
QUIET = {"status", "help"}     # commands that print their own output and are not logged

# Progress bar speed: seconds per animation frame. Bigger = slower, 0 = instant.
# Override without editing:  QASTHRA_DELAY=0.08 python Manager/operator.py "/auto(1)"
FRAME_DELAY = float(os.environ.get("QASTHRA_DELAY", "0.035"))
BAR_WIDTH = 24

TTY = sys.stdout.isatty()
GREEN, RED, YELLOW, DIM = "32", "31", "33", "2"


def paint(code, s):
    return f"\033[{code}m{s}\033[0m" if TTY else s


# ---------- errors: every failure carries a problem and an ideal fix ----------
class OpError(Exception):
    def __init__(self, problem, fix):
        super().__init__(problem)
        self.problem = problem
        self.fix = fix


def explain(e):
    """Turn any exception into (what went wrong, ideal fix) sentences."""
    if isinstance(e, OpError):
        return e.problem, e.fix
    if isinstance(e, PermissionError):
        return (f"Permission was denied for {e.filename or 'a file'}.",
                "Run termux-setup-storage, allow storage access, then run it again.")
    if isinstance(e, UnicodeDecodeError):
        return ("A file is not valid UTF-8 text, so it could not be read.",
                "Re-save that file as UTF-8, or restore it from Materials/Backups.")
    if isinstance(e, FileNotFoundError):
        return (f"A file or folder is missing: {e.filename or e}.",
                "Run the tool from the project folder and check the file still exists.")
    return (f"Something unexpected happened ({type(e).__name__}: {e}).",
            "Run the same command alone to reproduce it, then check the file and Manager/memory.txt.")


def trim(s, n):
    s = str(s)
    return s if len(s) <= n else s[:max(0, n - 3)] + "..."


# ---------- helpers ----------
def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def log(status, cmd, detail=""):
    """memory.txt: one entry per attempt, OK or FAIL, plus run markers."""
    lines = detail if isinstance(detail, (list, tuple)) else str(detail).splitlines()
    with open(MEMORY, "a", encoding="utf-8") as f:
        f.write(f"[{now()}] {status:<4} {cmd}\n")
        for ln in lines:
            f.write(f"    -> {ln}\n")


def ensure_folders():
    for base in FOLDERS.values():
        for t in TYPES.values():
            os.makedirs(os.path.join(MATERIALS, base, t), exist_ok=True)
    for p in (MEMORY, PLANNER):
        if not os.path.exists(p):
            open(p, "a", encoding="utf-8").close()


def ftype(name):
    ext = os.path.splitext(name)[1].lower()
    if ext not in TYPES:
        raise OpError(f"'{os.path.basename(name)}' is not an .html, .css or .js file.",
                      "Use a file name ending in .html, .css or .js.")
    return TYPES[ext]


def resolve(name):
    """Find a file by name in the project root or its folders."""
    direct = os.path.join(ROOT, name)
    if name and os.path.isfile(direct):
        return direct
    if name:
        for dp, dn, fn in os.walk(ROOT):
            dn[:] = [d for d in dn if d not in SKIP_DIRS]
            if os.path.basename(name) in fn:
                return os.path.join(dp, os.path.basename(name))
    raise OpError(f"The file '{name}' was not found in the project.",
                  "Check the spelling, or run /find(text) to see which files are searched "
                  "(Materials, Manager and Sources are skipped).")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, text):
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)


def unesc(s):
    return s.replace("\\n", "\n").replace("\\t", "\t")


def planner_commands():
    """Every command line in planner.txt (blank lines and # comments skipped)."""
    return [l.strip() for l in read(PLANNER).splitlines()
            if l.strip() and not l.strip().startswith("#")]


# ---------- undo support (all-or-nothing runs) ----------
SNAP = {}      # path -> original bytes (None = file did not exist)
CREATED = []   # helper files made during a run (backups, chunks)


def snapshot(path):
    if path in SNAP:
        return
    if os.path.isfile(path):
        with open(path, "rb") as f:
            SNAP[path] = f.read()
    else:
        SNAP[path] = None


def rollback():
    """Put every touched file back exactly as it was. Returns (restored, removed)."""
    restored = removed = 0
    for p, data in SNAP.items():
        try:
            if data is None:
                if os.path.isfile(p):
                    os.remove(p)
                    restored += 1
            else:
                cur = open(p, "rb").read() if os.path.isfile(p) else None
                if cur != data:
                    with open(p, "wb") as f:
                        f.write(data)
                    restored += 1
        except Exception as e:
            print(paint(RED, f"Could not restore {os.path.basename(p)}: {e}"))
    for p in CREATED:
        try:
            if os.path.isfile(p):
                os.remove(p)
                removed += 1
        except Exception:
            pass
    SNAP.clear()
    CREATED.clear()
    return restored, removed


# ---------- commands ----------
def c_find(a):
    if len(a) == 1:  # search all html/css/js
        targets = []
        for dp, dn, fn in os.walk(ROOT):
            dn[:] = [d for d in dn if d not in SKIP_DIRS]
            targets += [os.path.join(dp, x) for x in fn
                        if os.path.splitext(x)[1].lower() in TYPES]
        needle = a[0]
    else:
        targets, needle = [resolve(a[0])], a[1]
    total = 0
    for p in targets:
        for i, line in enumerate(read(p).splitlines(), 1):
            if needle in line:
                total += 1
                print(f"{os.path.basename(p)}:{i}: {line.strip()[:80]}")
    return f"{total} match(es) for '{needle}'"


def c_replace(a):
    if len(a) != 3:
        raise OpError("/replace needs three parts: file, old text and new text.",
                      "Write it as /replace(file|old|new).")
    p = resolve(a[0])
    ftype(p)
    old, new = unesc(a[1]), unesc(a[2])
    text = read(p)
    n = text.count(old)
    if n == 0:
        raise OpError(f"The old text was not found in {os.path.basename(p)}.",
                      "Run /find(file|part of the old text) and copy the exact text, "
                      "or run /status because it may already be applied.")
    write(p, text.replace(old, new))
    return f"Replaced {n} occurrence(s) in {os.path.basename(p)}"


def c_append(a):
    if len(a) != 2:
        raise OpError("/append needs two parts: file and text.",
                      "Write it as /append(file|text).")
    p = resolve(a[0])
    ftype(p)
    text = read(p)
    if text and not text.endswith("\n"):
        text += "\n"
    write(p, text + unesc(a[1]) + "\n")
    return f"Appended to {os.path.basename(p)}"


def c_delete(a):
    if len(a) != 2:
        raise OpError("/delete needs two parts: file and text.",
                      "Write it as /delete(file|text) (it deletes lines containing the text).")
    p = resolve(a[0])
    ftype(p)
    lines = read(p).splitlines(keepends=True)
    keep = [l for l in lines if a[1] not in l]
    if len(keep) == len(lines):
        raise OpError(f"No line in {os.path.basename(p)} contains '{trim(a[1], 40)}'.",
                      "Run /find(file|text) to check the text, or /status because it may already be deleted.")
    write(p, "".join(keep))
    return f"Deleted {len(lines) - len(keep)} line(s) from {os.path.basename(p)}"


def c_backup(a):
    p = resolve(a[0])
    t = ftype(p)
    stem, ext = os.path.splitext(os.path.basename(p))
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = os.path.join(MATERIALS, "Backups", t, f"{stem}_{stamp}{ext}")
    shutil.copy2(p, dest)
    CREATED.append(dest)
    return f"Backup saved: Materials/Backups/{t}/{os.path.basename(dest)}"


def c_chunk(a):
    """/chunk(file) splits every 100 lines. /chunk(file|10-50) saves a range."""
    p = resolve(a[0])
    t = ftype(p)
    stem, ext = os.path.splitext(os.path.basename(p))
    lines = read(p).splitlines(keepends=True)
    out = os.path.join(MATERIALS, "Chunks", t)
    made = []
    if len(a) > 1:
        m = re.match(r"^(\d+)-(\d+)$", a[1].strip())
        if not m:
            raise OpError(f"'{trim(a[1], 30)}' is not a valid line range.",
                          "Write the range like 10-50.")
        s, e = int(m.group(1)), int(m.group(2))
        if s < 1 or e < s or s > len(lines):
            raise OpError(f"Lines {s}-{e} do not fit {os.path.basename(p)}, which has {len(lines)} line(s).",
                          f"Pick a range inside 1-{len(lines)}, start first.")
        ranges = [(s, min(e, len(lines)))]
    else:
        ranges = [(i + 1, min(i + CHUNK_SIZE, len(lines)))
                  for i in range(0, len(lines), CHUNK_SIZE)]
    for s, e in ranges:
        name = f"{stem}_{s}-{e}{ext}"
        dest = os.path.join(out, name)
        write(dest, "".join(lines[s - 1:e]))
        CREATED.append(dest)
        made.append(name)
    return f"{len(made)} chunk(s) saved in Materials/Chunks/{t}: " + ", ".join(made)


def c_proto(a):
    """/proto(script.js) -> newest draft in Prototypes becomes script.js.
    /proto(draft.js|script.js) -> a named draft becomes script.js."""
    if len(a) == 2:
        draft_name, target_name = a
    else:
        draft_name = target_name = a[0]
    t = ftype(target_name)
    folder = os.path.join(MATERIALS, "Prototypes", t)
    draft = os.path.join(folder, draft_name)
    if not os.path.isfile(draft):
        files = [os.path.join(folder, f) for f in os.listdir(folder)]
        files = [f for f in files if os.path.isfile(f)]
        if not files:
            raise OpError(f"There is no draft in Materials/Prototypes/{t}.",
                          f"Save your draft in Materials/Prototypes/{t} first, then run it again.")
        draft = max(files, key=os.path.getmtime)  # newest draft
    try:
        target = resolve(target_name)
    except OpError:
        target = os.path.join(ROOT, target_name)
    shutil.copy2(draft, target)
    return f"{os.path.basename(draft)} is now {os.path.basename(target)}"


# ---------- status: is the current planner applied? ----------
ICON = {"APPLIED": "[x]", "PENDING": "[ ]", "PARTIAL": "[~]",
        "UNKNOWN": "[?]", "SKIP": "[-]"}


def _check(name, args):
    """Compare one planner command with the files. Returns (state, note)."""
    if name == "replace":
        if len(args) != 3:
            return "UNKNOWN", "bad format"
        text = read(resolve(args[0]))
        old, new = unesc(args[1]), unesc(args[2])
        if new:
            if new in text:
                if old in text and old not in new:
                    return "PARTIAL", "new text is there but old text remains"
                return "APPLIED", ""
            if old in text:
                return "PENDING", ""
            return "UNKNOWN", "neither old nor new text found"
        return ("PENDING", "") if old in text else ("APPLIED", "")

    if name == "append":
        if len(args) != 2:
            return "UNKNOWN", "bad format"
        text = read(resolve(args[0]))
        t = unesc(args[1]).strip()
        if t and t in text:
            return "APPLIED", ""
        return "PENDING", "text not found (or edited since)"

    if name == "delete":
        if len(args) != 2:
            return "UNKNOWN", "bad format"
        text = read(resolve(args[0]))
        return ("PENDING", "") if any(args[1] in l for l in text.splitlines()) else ("APPLIED", "")

    if name == "proto":
        draft_name, target_name = (args[0], args[1]) if len(args) == 2 else (args[0], args[0])
        t = ftype(target_name)
        folder = os.path.join(MATERIALS, "Prototypes", t)
        draft = os.path.join(folder, draft_name)
        if not os.path.isfile(draft):
            files = [os.path.join(folder, f) for f in os.listdir(folder)]
            files = [f for f in files if os.path.isfile(f)]
            if not files:
                return "UNKNOWN", "no draft found"
            draft = max(files, key=os.path.getmtime)
        try:
            target = resolve(target_name)
        except OpError:
            return "PENDING", "target file does not exist yet"
        return ("APPLIED", "") if read(draft) == read(target) else ("PENDING", "")

    return "SKIP", ""


def c_status(a):
    cmds = planner_commands()
    if not cmds:
        print("Planner is empty (Manager/planner.txt)")
        return "Planner empty"
    counts = {}
    for c in cmds:
        try:
            name, args = parse(c)
            if name in MUTATING:
                state, note = _check(name, args)
            elif name in COMMANDS or name == "auto":
                state, note = "SKIP", "no lasting change to check"
            else:
                state, note = "UNKNOWN", f"unknown command /{name}"
        except Exception as e:
            state, note = "UNKNOWN", explain(e)[0]
        counts[state] = counts.get(state, 0) + 1
        short = c if len(c) <= 70 else c[:67] + "..."
        print(f"{ICON[state]} {state:<8} {short}" + (f"  ({note})" if note else ""))
    checkable = len(cmds) - counts.get("SKIP", 0)
    applied = counts.get("APPLIED", 0)
    if checkable == 0:
        overall = "NOTHING TO CHECK"
    elif applied == checkable:
        overall = "APPLIED"
    elif applied == 0 and not counts.get("PARTIAL"):
        overall = "NOT APPLIED"
    else:
        overall = "PARTIAL"
    print(f"\nPlanner: {applied}/{checkable} applied -> {overall}")
    return overall


# ---------- help ----------
HELP = r"""QASTHRA Operator

Usage:  python Manager/operator.py "/command(data)"
        python Manager/operator.py            (interactive, q to quit)

Commands
  /find(text)               search every html/css/js file
  /find(file|text)          search one file
  /replace(file|old|new)    replace every occurrence (\n and \t work)
  /append(file|text)        add text at the end of a file
  /delete(file|text)        delete every line containing text
  /backup(file)             copy a file into Materials/Backups
  /chunk(file)              split a file into 100-line chunks
  /chunk(file|10-50)        save lines 10 to 50 as one chunk
  /proto(file)              newest draft in Materials/Prototypes becomes file
  /proto(draft|file)        a named draft becomes file
  /auto(1)                  run Manager/planner.txt, backing up each file first
  /auto(0)                  run Manager/planner.txt with no backups
  /status                   check whether the current planner is applied
  /help                     show this help

All-or-nothing
  /auto checks every planner line first. If a line is invalid, nothing runs.
  If a command fails while running, the run STOPS and every change is undone,
  so the files are exactly as they were. You get what went wrong and the
  ideal fix. A replace/delete that matches nothing counts as a failure.

Status marks
  [x] APPLIED   [ ] PENDING   [~] PARTIAL   [?] UNKNOWN   [-] SKIP

How /status decides
  replace  applied when the new text is in the file and the old text is gone
  append   applied when the appended text is found in the file
  delete   applied when no line contains the text
  proto    applied when the target file matches the draft
  If you edit the files by hand afterwards, a line may show PENDING or UNKNOWN.

Files
  Manager/planner.txt   one command per line, # starts a comment
  Manager/memory.txt    log of every attempt (OK / FAIL) with the reason

Speed
  QASTHRA_DELAY=0.08 python Manager/operator.py "/auto(1)"   slower bar
  QASTHRA_DELAY=0    python Manager/operator.py "/auto(1)"   instant bar
"""


def c_help(a):
    print(HELP)
    return "Help shown"


COMMANDS = {"find": c_find, "replace": c_replace, "append": c_append,
            "delete": c_delete, "backup": c_backup, "chunk": c_chunk,
            "proto": c_proto, "status": c_status, "help": c_help}


# ---------- parsing ----------
def parse(line):
    m = re.match(r"^/(\w+)(?:\((.*)\))?$", line.strip())
    if not m:
        raise OpError(f"'{trim(line, 50)}' is not in the /command(data) format.",
                      "Write it like /replace(file|old|new) and use /help to see every format.")
    name, data = m.group(1).lower(), m.group(2)
    if data is None:
        if name not in BARE:
            raise OpError(f"/{name} needs its data inside brackets.",
                          f"Write it as /{name}(...) and use /help to see the format.")
        return name, []
    if name in BARE:
        return name, []
    if name == "auto":
        return name, [data.strip()]
    maxsplit = {"replace": 2, "find": 1, "append": 1, "delete": 1,
                "chunk": 1, "proto": 1}.get(name, 0)
    return name, [x.strip() if i == 0 else x
                  for i, x in enumerate(data.split("|", maxsplit))]


# ---------- progress bar ----------
class Bar:
    def __init__(self, total):
        self.total = total

    def _text(self, p, idx, label):
        cols = shutil.get_terminal_size((60, 20)).columns
        w = min(BAR_WIDTH, max(8, cols - 32))
        fill = int(w * p)
        head = f"[{'█' * fill}{'░' * (w - fill)}] {int(round(p * 100)):3d}% {idx}/{self.total} "
        return head + trim(label, max(0, cols - len(head) - 1))

    def draw(self, p, idx, label, color):
        if TTY:
            sys.stdout.write("\r\033[K" + paint(color, self._text(p, idx, label)))
            sys.stdout.flush()

    def animate(self, a, b, idx, label, color):
        """Glide the bar from a to b (fractions 0..1), slowly."""
        if not TTY or FRAME_DELAY <= 0:
            self.draw(b, idx, label, color)
            return
        frames = max(6, round((b - a) * 80))
        for k in range(1, frames + 1):
            self.draw(a + (b - a) * k / frames, idx, label, color)
            time.sleep(FRAME_DELAY)

    def say(self, text):
        if TTY:
            sys.stdout.write("\r\033[K")
        print(text)


# ---------- engine ----------
def exec_cmd(name, args, backed):
    """Run one command; remember the original file first so it can be undone."""
    if name in MUTATING:
        tname = args[-1] if name == "proto" else args[0]
        try:
            p = resolve(tname)
        except OpError:
            p = os.path.join(ROOT, tname) if name == "proto" else None
        if p:
            snapshot(p)
            if backed is not None and os.path.isfile(p) and p not in backed:
                msg = c_backup([tname])
                log("OK", f"[auto] /backup({tname})", msg)
                backed.add(p)
    return COMMANDS[name](args)


def run_batch(cmds, label, backup):
    """Run commands all-or-nothing with a progress bar.
    label=None means a single command typed by hand. Returns True on success."""
    n = len(cmds)
    if label:
        log("RUN", label, f"{n} planner command(s)")

    # 1) check every line before touching anything
    parsed = []
    for k, c in enumerate(cmds, 1):
        try:
            name, args = parse(c)
            if name == "auto":
                raise OpError("A planner line cannot contain /auto.",
                              "Remove that line so the planner only holds real commands.")
            if name not in COMMANDS:
                raise OpError(f"/{name} is not a command.",
                              "Check the spelling and use /help to see every command.")
            parsed.append((name, args))
        except Exception as e:
            problem, fix = explain(e)
            print(paint(RED, f"FAIL line {k}: ") + trim(c, 70))
            print(f"What went wrong: {problem}")
            print(f"Ideal fix: {fix}")
            print("Nothing was run and nothing was changed.")
            log("FAIL", c, [f"planner line {k}: {problem}", "fix: " + fix])
            if label:
                log("STOP", label, "invalid line, nothing was applied")
            return False

    if label:
        print(f"{label}: {n} command(s), backup={'on' if backup else 'off'}, all-or-nothing")
    SNAP.clear()
    CREATED.clear()
    bar = Bar(n)
    backed = set() if backup else None
    results = []        # (state, text)
    failure = None      # (problem, fix)

    # 2) run one by one, stop at the first failure
    for i, (c, (name, args)) in enumerate(zip(cmds, parsed)):
        a, m, b = i / n, (i + 0.5) / n, (i + 1) / n
        bar.animate(a, m, i + 1, c, YELLOW)
        buf = io.StringIO()
        result = ""
        try:
            with contextlib.redirect_stdout(buf):
                result = exec_cmd(name, args, backed)
        except KeyboardInterrupt:
            failure = ("You stopped the run with Ctrl+C.", "Run it again when you are ready.")
        except Exception as e:
            failure = explain(e)
        if failure:
            bar.draw(m, i + 1, c, RED)
            results.append(("FAIL", failure[0]))
            log("FAIL", c, [failure[0], "fix: " + failure[1]])
            break
        bar.animate(m, b, i + 1, c, GREEN)
        out = buf.getvalue().rstrip()
        if out:
            bar.say(out)
            bar.draw(b, i + 1, c, GREEN)
        if not TTY:
            print(f"[{int(round(b * 100)):3d}%] {i + 1}/{n} OK  {trim(c, 60)}")
        results.append(("OK", result))
        log("OK", c, result)
    if TTY:
        sys.stdout.write("\n")
    results += [("SKIP", "not run")] * (n - len(results))

    # 3) report
    if label is None:
        if not failure:
            print("OK ", results[0][1])
            return True
    else:
        print()
        cols = shutil.get_terminal_size((60, 20)).columns
        tag = {"OK": paint(GREEN, "[OK]  "), "FAIL": paint(RED, "[FAIL]"), "SKIP": paint(DIM, "[SKIP]")}
        for k, (c, (state, text)) in enumerate(zip(cmds, results), 1):
            print(f"{tag[state]} {k}. {trim(c, cols - 14)}")
            if state != "SKIP":
                print(f"       {trim(text, cols - 10)}")
        if not failure:
            print(f"\nDone: {n}/{n} applied.")
            log("DONE", label, f"{n}/{n} applied")
            return True

    problem, fix = failure
    restored, removed = rollback()
    failed_at = next(k for k, (s, _) in enumerate(results, 1) if s == "FAIL")
    print(f"\nStopped at step {failed_at}/{n}.")
    print(f"What went wrong: {problem}")
    print(f"Ideal fix: {fix}")
    print(f"Undone: {restored} file(s) restored, {removed} helper file(s) removed. "
          "No changes were kept.")
    if label:
        log("ROLL", label, f"{restored} file(s) restored, {removed} helper file(s) removed")
        log("STOP", label, f"stopped at step {failed_at}/{n}, nothing was applied")
    return False


def show_error(cmd, e):
    problem, fix = explain(e)
    print(paint(RED, "FAIL ") + trim(cmd, 70))
    print(f"What went wrong: {problem}")
    print(f"Ideal fix: {fix}")
    log("FAIL", cmd, [problem, "fix: " + fix])


def c_auto(flag):
    if flag not in ("0", "1"):
        raise OpError(f"/auto got '{trim(flag, 20)}' but only 0 or 1 is allowed.",
                      "Use /auto(1) to back up first, or /auto(0) for no backup.")
    cmds = planner_commands()
    if not cmds:
        raise OpError("The planner is empty.",
                      "Add one command per line to Manager/planner.txt, then run it again.")
    return run_batch(cmds, f"/auto({flag})", flag == "1")


def run(line):
    """Run one typed command. Returns True on success, False on failure."""
    line = line.strip()
    try:
        name, args = parse(line)
        if name == "auto":
            return c_auto(args[0])
        if name not in COMMANDS:
            raise OpError(f"/{name} is not a command.",
                          "Check the spelling and use /help to see every command.")
    except Exception as e:
        show_error(line, e)
        return False
    if name in QUIET or name == "find":
        try:
            result = COMMANDS[name](args)
        except Exception as e:
            show_error(line, e)
            return False
        if name not in QUIET:
            log("OK", line, result)
            print("OK ", result)
        return True
    return run_batch([line], None, None)


def main():
    ensure_folders()
    if len(sys.argv) > 1:
        sys.exit(0 if run(" ".join(sys.argv[1:])) else 1)
    print("QASTHRA Operator | commands: find replace append delete backup chunk proto auto status help | q = quit")
    while True:
        try:
            line = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if line.lower() in ("q", "quit", "exit"):
            break
        if line:
            run(line)


if __name__ == "__main__":
    main()
