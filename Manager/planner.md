# photos: png and jpg only
/replace(script.js|f.accept='.jpg,.jpeg,.png,.webp';|f.accept='.jpg,.jpeg,.png,image/jpeg,image/png';)
/replace(script.js|var x=f.files&&f.files[0];if(!x)return;if(x.size>8000000){|var x=f.files&&f.files[0];if(!x)return;if(['image/jpeg','image/png'].indexOf(x.type)<0||['jpg','jpeg','png'].indexOf(x.name.toLowerCase().split('.').pop())<0){f.value='';msg.textContent='Only PNG and JPG images are allowed.';return}if(x.size>8000000){)
