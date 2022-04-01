class Slider {
    constructor({
        slider = ".slider",
        sliderLines = ".slider__lines",
        sliderItem = ".slider__item",
        duration = 400,
        direction = "x",
        active = 0,
        buttons = true,
        pagination = false,
        autoplay = false,
        slidesToMove = 1,
        slidesToShow = 1,
        autoplayTime = 5000,
        breakpoints
    }) {
        this.slider =
            typeof slider == "string" ? document.querySelector(slider) : slider;
        this.sliderLines =
            typeof sliderLines == "string"
                ? this.slider.querySelector(sliderLines)
                : sliderLines;
        this.sliderItems =
            typeof sliderItem == "string"
                ? [...this.slider.querySelectorAll(sliderItem)]
                : sliderItem;
        this.duration = duration;
        this.direction = direction.toUpperCase();
        this.active = active;
        this.buttons = buttons;
        this.pagination = pagination;
        this.posX1 = 0;
        this.posX2 = 0;
        this.posInit = 0;
        this.autoplay = autoplay;
        this.autoplayTime = autoplayTime;
        this.slidesToMove = slidesToMove;

        if (this.slidesToMove >= this.sliderItems.length || this.slidesToMove <= 0) {
            this.slidesToMove = 1;
            alert(`Ля ты крыса, используй меньшее число для прокрутки слайдов за раз`);
        }
        if (this.active < 0 || active > this.sliderItems.length - 1) {
            alert(`Ля ты крыса, используй меньшее число для активного слайда`);
            this.active = 0;
        }
        this.sliderTrueSize = this.slider.querySelector('.slider__true-size');
        this.slidesToShow = slidesToShow > 0 && slidesToShow < 5 ? slidesToShow : 1;
        this.breakpoints = breakpoints;
        this.copySlider = {};
        for (const key in this) {
            this.copySlider[key] = this[key];
        }
        console.log(this.slidesToShow);
        this.interval;
        if (this.buttons) {
            this.prev = this.slider.querySelector(".slider__prev");
            this.next = this.slider.querySelector(".slider__next");
            this.prev.addEventListener("click", () => this.movePrevious());
            this.next.addEventListener("click", () => this.moveNext());
            this.disableButtons();
        }
        if (this.pagination) {
            this.navigation = this.slider.querySelector('.slider__pagination');
            for (let i = 0; i < this.sliderItems.length; i++) {
                let li = document.createElement('li');
                this.navigation.append(li);
            }
            this.bullets = [...this.navigation.children];
            this.bullets.forEach(item => {
                item.addEventListener('click', (e) => this.bulletsClick(e));
            })
        }
        this.basicStyles();
        window.addEventListener('resize', () => {
            this.basicStyles();
        })
        this.setClass();
        this.slider.addEventListener('touchstart', this.touchStart, { passive: true })
        this.slider.addEventListener('mousedown', this.touchStart);
    }
    basicStyles() {
        this.slider.style.overflow = "hidden";
        this.sliderLines.style.overflow = "hidden";
        this.sliderLines.style.display = "flex";
        if (this.breakpoints) {
            let sorting = (a, b) => a - b;
            let keys = Object.keys(this.breakpoints).sort(sorting).reverse();
            keys.push(0);
           for (let i = 0; i < keys.length; i++) {
            if (window.innerWidth <= keys[i] && window.innerWidth > keys[i+1]) {
                for (const id in this.breakpoints[keys[i]]) {
                    this[id] = this.breakpoints[keys[i]][id];
                    console.log(this[id], this.breakpoints[keys[i]][id]);
                }
            } else if(window.innerWidth > keys[0]) {
                for (const id in this.breakpoints[keys[i]]) {
                    this[id] = this.copySlider[id];
                }
            }
           }
        }
        this.sliderItems.forEach(item => {
            item.style.width = this.sliderTrueSize.offsetWidth / this.slidesToShow + 'px';
        })
        let commonWidth = this.sliderItems.reduce((acc, item) => acc + item.offsetWidth, 0);
        let commonHeight = this.sliderItems.reduce((acc, item) => acc + item.offsetHeight, 0);
        this.sliderTrueSize.style.overflow = 'hidden';
        if (this.direction == 'Y') {
            this.sliderLines.style.flexDirection = 'column';
            this.sliderTrueSize.style.height = this.sliderItems[this.active].offsetHeight + 'px';
            this.sliderLines.style.height = commonHeight + "px";
        }
        else this.sliderLines.style.width = commonWidth + "px";

        this.sliderLines.style.transition = `${this.duration}ms`;
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
    }
    movePrevious() {
        this.sliderLines.style.transition = `${this.duration}ms`;
        if (this.active - this.slidesToMove >= 0) this.active -= this.slidesToMove;
        else this.active--;
        if (this.active < 0) this.active = 0;
        if (this.buttons) this.disableButtons();
        this.setClass();
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
    }
    moveNext() {
        this.sliderLines.style.transition = `${this.duration}ms`;
        if (this.active + this.slidesToMove < this.sliderItems.length + 1) this.active += this.slidesToMove;
        else this.active++;
        if (this.active >= this.sliderItems.length - 1) this.active = this.sliderItems.length - 1;
        if (this.buttons) this.disableButtons();
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
        this.setClass();
    }
    slidesToMoving() {
        let limit = this.sliderItems[this.active].offsetWidth;
        let limit2 = this.sliderItems[this.active].offsetHeight;
        if (this.direction == 'Y') return limit2 * this.active;
        else return limit * this.active;
    }
    setClass() {
        this.sliderItems.forEach((item, i) => {
            item.classList.remove("active");
            item.classList.remove("prev");
            item.classList.remove("next");
            if (this.pagination) {
                this.bullets[i].classList.remove('active');
            }
        });
        this.sliderItems[this.active].classList.add("active");
        if (this.pagination) this.bullets[this.active].classList.add('active');
        if (this.sliderItems[this.active].nextElementSibling) this.sliderItems[this.active].nextElementSibling.classList.add("next");
        else this.sliderItems[0].classList.add("next");
        if (this.sliderItems[this.active].previousElementSibling) this.sliderItems[this.active].previousElementSibling.classList.add("prev");
        else this.sliderItems[this.sliderItems.length - 1].classList.add("prev");
    }
    disableButtons() {
        if (this.active <= 0) {
            this.prev.disabled = true;
        }
        else this.prev.disabled = false;
        if (this.active >= this.sliderItems.length - 1) {
            this.next.disabled = true;
        }
        else this.next.disabled = false;

    }
    bulletsClick(e) {
        this.sliderLines.style.transition = `${this.duration}ms`;
        let index = this.bullets.indexOf(e.target);
        this.active = index;
        this.setClass();
        if (this.buttons) this.disableButtons();
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
    }
    touchStart = (e) => {
        if (e.type == 'touchstart') this.posX1 = this.direction == 'X' ? e.touches[0].clientX : e.touches[0].clientY;
        else this.posX1 = this.direction == 'X' ? e.clientX : e.clientY;
        document.addEventListener('touchmove', this.touchMove);
        document.addEventListener('mousemove', this.touchMove);
        document.addEventListener('touchend', this.touchEnd);
        document.addEventListener('mouseup', this.touchEnd);
        // document.addEventListener('touchcancel', (e) => this.touchCancel(e))
    }

    touchMove = (e) => {
        if (e.type == 'touchmove') this.posX2 = this.direction == 'X' ? e.changedTouches[0].clientX : e.changedTouches[0].clientY;
        else this.posX2 = this.direction == 'X' ? e.clientX : e.clientY;
        this.posInit = this.posX2 - this.posX1;
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving() + this.posInit}px)`;
    }
    touchEnd = (e) => {
        let end = this.direction == 'Y' ? this.slider.clientHeight / 100 * 15 : this.slider.clientWidth / 100 * 15;
        if (this.posInit > end) {
            this.movePrevious();
        }
        else if (this.posInit < -end) {
            this.moveNext();
        }
        else {
            this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
        }
        this.posX1 = 0;
        this.posX2 = 0;
        this.posInit = 0;
        document.removeEventListener('touchmove', this.touchMove, { passive: true })
        document.removeEventListener('mousemove', this.touchMove, { passive: true })
        document.removeEventListener('touchend', this.touchEnd, { passive: true })
        document.removeEventListener('mouseup', this.touchEnd, { passive: true })
    }
    autoplaying() {
        this.interval = setInterval(() => {
            this.moveNext()
        }, this.autoplayTime + this.duration);
    }
}
const mySlider = new Slider({
    slider: ".slider2",
    sliderLines: ".slider__lines",
    sliderItem: ".slider__item",
    duration: 200,
    direction: "x",
    active: 0,
    pagination: true,
    slidesToMove: 1,
    buttons: true,
    slidesToShow: 2,
    breakpoints: {
        720: {
            slidesToShow: 1
        }
    }
});

