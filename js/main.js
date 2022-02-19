const sliderWrapper = document.querySelector('.slider-wrapper');
const slideRight = document.querySelector('.right-slide');
const slideLeft = document.querySelector('.left-slide');
const upButton = document.querySelector('.up-btn');
const downButton = document.querySelector('.down-btn');
const sliderHeight = sliderWrapper.clientHeight;
const slidesLength = slideLeft.querySelectorAll('div').length;
const slidesArray = document.querySelectorAll('.right-slide, .left-slide');

let activeSlideIndex = 0;
let animationIsActive = false;
let reject

slideLeft.style.top = `-${(slidesLength - 2) * sliderHeight}px`;

const changeSlide = (direction) => {
  return new Promise((resolve) => {
    animationIsActive = true;
    slidesArray.forEach(el => el.classList.add('animation'));
    direction === 'up' ? activeSlideIndex++ : activeSlideIndex--;
    slideRight.style.transform = `translateY(${activeSlideIndex * -sliderHeight}px)`;
    slideLeft.style.transform = `translateY(${activeSlideIndex * sliderHeight}px)`;
    this.addEventListener('transitionend', () => {
      animationIsActive = false;
      slidesArray.forEach(el => {
        el.classList.remove('animation');
        el.style.transform = 'none';
      });
      resolve();
    }, {once: true})
  }).then(() => {
    if (activeSlideIndex > 0) {
      slideRight.append(slideRight.querySelector('.main-img:first-child'));
      slideLeft.prepend(slideLeft.querySelector('.slide-card:last-child'));
      activeSlideIndex = 0;
    } else if (activeSlideIndex < 0) {
      slideRight.prepend(slideRight.querySelector('.main-img:last-child'));
      slideLeft.append(slideLeft.querySelector('.slide-card:first-child'));
      activeSlideIndex = 0;
    };
  });
};

upButton.addEventListener('click', () => (animationIsActive) ? 0 : changeSlide('up'));
downButton.addEventListener('click', () => (animationIsActive) ? 0 : changeSlide('down'));
document.addEventListener('wheel', (e) => (reject || animationIsActive) ? 0 : e.deltaY > 0 ? changeSlide('up') : changeSlide('down'));
document.addEventListener('mousedown', (e) => {
  if (reject || animationIsActive) return 0
  e.preventDefault();
  let pxToSlide = 50;
  startTop = slideRight.offsetTop;
  startPointY = e.clientY;

  document.onmousemove = (e) => {
    endPointY = startPointY - e.clientY;
    startPointY = e.clientY;
    slideRight.style.top = `${slideRight.offsetTop - endPointY/5}px`;
  };

  document.onmouseup = () => {
    endTop = slideRight.offsetTop;
    if (endTop - startTop < -pxToSlide) {
      slideRight.style.top = '-100vh';
      changeSlide('up');
    } else if (endTop - startTop > pxToSlide) {
      slideRight.style.top = '-100vh';
      changeSlide('down');
    } else {
      slideRight.style.top = `${startTop}px`;
      reject = true
      slideRight.classList.add('animation')
      this.addEventListener('transitionend', () => {
        reject = false
        slideRight.classList.remove('animation')
      })
    }
    document.onmouseup = null;
    document.onmousemove = null;
  };
});