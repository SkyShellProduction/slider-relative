## Own Simple Slider by vanilla JavaScript
> Possibilities
- works by touch
- works by mouse
- you can use only pagination
- you can use only prev, next buttons
- you can use the both of them
- you can use only slider without buttons and pagination
- you can change direction
- you can change duration
- you can select the active slider - counting starts from 0
- you can use how much slides are shown 
- you can use how much slides are moving
- you can write classes fro slider, sliderLines and sliderItems
- you can write breakpoints to change some values on resize
### simple example

>html
            <div class="slider slider2">
                <div class="slider__true-size">
                    <div class="slider__lines">
                        <div class="slider__item">
                            <img src="images/01.jpg" alt="" />
                        </div>
                        <div class="slider__item">
                            <img src="images/02.jpg" alt="" />
                        </div>
                        <div class="slider__item">
                            <img src="images/03.jpg" alt="" />
                        </div>
                        <div class="slider__item">
                            <img src="images/04.jpg" alt="" />
                        </div>
                    </div>
                </div>
                <ul class="slider__pagination"></ul>
                <div class="slider__buttons">
                    <button class="slider__prev">prev</button>
                    <button class="slider__next">next</button>
                </div>
            </div>
