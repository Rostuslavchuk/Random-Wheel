document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();

    const params = {
        input: document.getElementById("header__input"),
        addBtn: document.getElementById("header__add"),
        circle: document.getElementById("main__circle"),
        sectionDivs: document.querySelectorAll("#main__circle div"),
        spinBtn: document.getElementById("footer__spin"),
        section: document.getElementById("section"),
        result: document.getElementById("result"),
        startPosition: 0     
    }


    params.input.oninput = (e) => {
        e.preventDefault(); 

        if(e.target.value.length >= 1 && e.target.value.match(/[A-Za-z0-9]/)){
            params.addBtn.disabled = false;
        }
        else{
            params.addBtn.disabled = true;
        }
    }

    params.addBtn.onclick = (e) => {
        e.preventDefault(); 

        const allSpans = params.circle.querySelectorAll('div');
        
        const root = document.documentElement;
        const styles = getComputedStyle(root);

        if(params.input.value){

            let propCounter = parseInt(styles.getPropertyValue("--counter"));
            root.style.setProperty("--counter", propCounter + 1);

            params.circle.insertAdjacentHTML("beforeend", `
                <div style="--i: ${allSpans.length+1};">
                    <span>${params.input.value.trim()}</span>
                    <i></i>
                </div>`);

            propCounter = propCounter + 1;
            params.propCounter = propCounter;

            if (propCounter === 1) {
                document.querySelectorAll("#main__circle div").forEach(el => {
                    el.style.width = '100%';
                    el.style.height = '100%';
                    el.style.clipPath = 'none';
                });
            } 
            if (propCounter === 2) {
                document.querySelectorAll("#main__circle div").forEach(el => {
                    el.style.width = '100%';
                    el.style.height = '50%';
                    el.style.clipPath = 'none';
                });
            } 
            if (propCounter > 2) {
                document.querySelectorAll("#main__circle div").forEach(el => {
                    el.style.height = '50%';
                    el.style.width = `calc(100% * tan(${180 / propCounter}deg))`;
                    el.style.clipPath = 'polygon(50% 100%, 100% 0, 0 0)';
                });
            }
            
            params.input.value = '';
            params.addBtn.disabled = true;
        }
    }

    params.spinBtn.onclick = (e) => {
        e.preventDefault(); 
    
        params.spinBtn.disabled = true;
    
        const namesArray = [];
        params.circle.querySelectorAll('div span').forEach(el => {
            namesArray.push(el);
        });
    
        let getRandomSpan = namesArray[Math.floor(Math.random() * namesArray.length)];
    
        const spanBouncingRect = getRandomSpan.getBoundingClientRect(); 
        const sectionBouncingRect = params.section.getBoundingClientRect();
        
        const spanCenterX = spanBouncingRect.left + spanBouncingRect.width / 2;
        const spanCenterY = spanBouncingRect.top + spanBouncingRect.height / 2;
        const sectionCenterX = sectionBouncingRect.left + sectionBouncingRect.width / 2;
        const sectionCenterY = sectionBouncingRect.top + sectionBouncingRect.height / 2;

        const circleCenterX = params.circle.getBoundingClientRect().left + params.circle.getBoundingClientRect().width / 2;
        const circleCenterY = params.circle.getBoundingClientRect().top + params.circle.getBoundingClientRect().height / 2;

        const currentAngle = Math.atan2(spanCenterY - circleCenterY, spanCenterX - circleCenterX) * (180 / Math.PI);
        const targetAngle = Math.atan2(sectionCenterY - circleCenterY, sectionCenterX - circleCenterX) * (180 / Math.PI);

        let angleOffset = targetAngle - currentAngle;

        if (angleOffset < 0) {
            angleOffset += 360;
        }

        let start = params.startPosition ? params.startPosition : 0;
        let rotate = start + 360 * 5 + angleOffset;

        params.circle.style.transition = 'none';
        params.circle.style.transform = `rotate(${start}deg)`;

        requestAnimationFrame(() => {
            params.circle.style.transition = 'transform 5s ease';
            params.circle.style.transform = `rotate(${rotate}deg)`;
        });

        setTimeout(() => {
            params.spinBtn.disabled = false;
            params.startPosition = rotate % 360;

            params.result.textContent = getRandomSpan.textContent;
        }, 5000);

    };  
});