import $ from 'jquery';
import anime from 'animejs';



// anime({
//     targets: 'div',
//     translateX: 500,
//     duration: 1000
// });



/*
var responsiveSlider = function() {

  var slider = document.getElementById("office__slider");
  var sliderWidth = slider.offsetWidth;
  var slideList = document.getElementById("office__slider--wrap");
  var count = 1;
  var items = slideList.querySelectorAll("li").length;
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");

  window.addEventListener('resize', function() {     
    sliderWidth = slider.offsetWidth;
  });

  var prevSlide = function() {
    if(count > 1) {
      count = count - 2;
      slideList.style.left = "-" + count * sliderWidth + "px";
      count++;
    }
    else if(count = 1) {
      count = items - 1;
      slideList.style.left = "-" + count * sliderWidth + "px";
      count++;
    }
  };

  var nextSlide = function() {
    if(count < items) {
      slideList.style.left = "-" + count * sliderWidth + "px";
      count++;
    }
    else if(count = items) {
      slideList.style.left = "0px";
      count = 1;
    }
  };
  
  next.addEventListener("click", function() {
    nextSlide();
  });

  prev.addEventListener("click", function() {
    prevSlide();
  });
  
  setInterval(function() {
    nextSlide()
  }, 8000);

};

window.onload = function() {
  responsiveSlider();  
}
*/



class Slider {
    constructor(props) {


        this.rootElement = props.element.querySelector(".office__slider");
        this.slides = Array.from(
            this.rootElement.querySelectorAll(".office__item")
        );


        this.slidesLength = this.slides.length;
        this.current = 0;
        this.isAnimating = false;
        this.direction = 1; // -1
        this.baseAnimeSettings = {
            duration: 750,
            elasticity: 0,
            easing: 'easeInOutCirc'
        };


        this.prevButton = props.element.querySelector("#prev");
        this.nextButton = props.element.querySelector("#next");

        this.slides[this.current].classList.add("slider-list__item_active");


        this._bindEvents();
    }

    goTo(index, dir) {
      console.log('goTo' + index + ' к ' + dir);
        if (this.isAnimating) return;
        var self = this;
        console.log(self);


        let prevSlide = this.slides[this.current];
        let nextSlide = this.slides[index];

        self.isAnimating = true;
        self.current = index;


        nextSlide.classList.add("slider-list__item_active");

        anime(Object.assign({}, self.baseAnimeSettings, {
            targets: nextSlide,
            translateX: [100 * dir + '%', 0]
        }));

        anime(Object.assign({}, self.baseAnimeSettings, {
            targets: prevSlide,
            translateX: [ 0, -100 * dir + '%'],
            complete: function(anim) {
                self.isAnimating = false;
                prevSlide.classList.remove("slider-list__item_active");
            }
        }))
    }

    goStep(dir) {
        console.log(dir + 'шаг');

        let index = this.current + dir;
        let len = this.slidesLength;
        let currentIndex = (index + len) % len;
        this.goTo(currentIndex, dir);
    }

    goNext() {
        this.goStep(1);
    }

    goPrev() {
        this.goStep(-1);
    }

    // _navClickHandler(e) {
    //     var self = this;
    //     if (self.isAnimating) return;
    //     let target = e.target.closest(".nav-control");
    //     if (!target) return;
    //     let index = self.thumbs.indexOf(target);
    //     if (index === self.current) return;
    //     let direction = index > self.current ? 1 : -1;
    //     self.goTo(index, direction);
    // }

    _bindEvents() {
        var self = this;
        ["goNext", "goPrev"].forEach(method => {
            self[method] = self[method].bind(self);
        });
        self.nextButton.addEventListener("click", self.goNext);
        self.prevButton.addEventListener("click", self.goPrev);
        // self.navBar.addEventListener("click", self._navClickHandler);
    }
}


// ===== init ======
let slider = new Slider({
    element: document.querySelector(".office__content")
});
