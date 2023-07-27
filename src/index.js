class Swiper {
  constructor(obj) {
    this.imgArr = obj.imgArr || []
    // 真实需要渲染的arr
    this.retImgArr = [this.imgArr[this.imgArr.length - 1],...this.imgArr, this.imgArr[0]];
    this.aniTime = obj.aniTime || 1500;
    this.intervalTime = obj.intervalTime + this.aniTime || 2500;
    this.nowIndex = 0;

    this.swiperListDom = document.getElementsByClassName('swiper-container')[0];

    this.swiperSpotDom = null;
    this.leftBtn = null;
    this.rightBtn = null;
    this.mainDom = null;

    this.moveWidth = this.swiperListDom.offsetWidth;
    this.timer = null;

    this.prev = Date.now();
    this.autoplay = obj.autoplay;
  }
  init() {
    this.initDom();

    // 轮播图单张
    let li = '';
    this.retImgArr.forEach((item, index) => {
      li += `<li style="left: ${index * this.moveWidth}px; width:${this.moveWidth}px" class="swiper-item">
              <a href="${item.url}"><img src="${item.imgPath}" alt=""></a>
              </li>`
    })
    this.mainDom.innerHTML = li;

    // 小圆点
    let spotLi = '';
    this.imgArr.forEach((_, index) => {
      if(index == 0) {
        spotLi += `<li class="spot-item" style="background-color: #ff5c1f;" index=${index}></li>`
      } else {
        spotLi += `<li class="spot-item" index=${index}></li>`
      }
    })
    this.swiperSpotDom.innerHTML = spotLi;

    // 绑定事件
    this.eventBind();
  }

  eventBind() {
    // 左边
    // this.leftBtn.addEventListener('mouseover', () => {
    //   clearInterval(this.timer);
    // })
    // this.leftBtn.addEventListener('mouseout', () => {
    //   this.timer = setInterval(this.nextSlider(this.aniTime), this.intervalTime);
    // })
    this.leftBtn.addEventListener('click', () => {
      this.throttle(this.prevSlider(this.aniTime), 200);
    })

    // 右边
    this.rightBtn.addEventListener('click', () => {
      this.throttle(this.nextSlider(this.aniTime), 200);
    })
    // this.rightBtn.addEventListener('mouseover', () => {
    //   clearInterval(this.timer);
    // })
    // this.rightBtn.addEventListener('mouseout', () => {
    //   this.timer = setInterval(this.nextSlider(this.aniTime), this.intervalTime);
    // })

    // 小圆点事件绑定
    this.swiperSpotDom.addEventListener('click', (e) => {
      let target = e.target;
      if(target.tagName.toLowerCase() === 'li') {
        let ret = this.swiperSpotDom.querySelectorAll('li');
        let index = Array.prototype.indexOf.call(ret, target);
        this.nowIndex = index;
        this.setActiveSpot();
        this.mainDom.style.transition = `left .8s`;
        this.mainDom.style.left = `${-(this.nowIndex + 1) * this.moveWidth}px`;
      }
    })
  }

  // 初始化dom
  initDom() {
    // 初始化轮播图容器
    this.mainDom = document.createElement('ul');
    this.mainDom.className = 'swiper-main';
    this.mainDom.style.width = `${this.moveWidth * this.retImgArr}px`;
    this.mainDom.style.left = `${-this.moveWidth}px`;
    this.swiperListDom.appendChild(this.mainDom);

    // 小圆点ul容器
    this.swiperSpotDom = document.createElement('ul');
    this.swiperSpotDom.className = 'swiper-spot';
    this.swiperListDom.appendChild(this.swiperSpotDom);

    // 上一张按钮
    this.leftBtn = document.createElement('img');
    this.leftBtn.className = 'left-btn';
    this.leftBtn.src = '../img/left.png';
    this.swiperListDom.appendChild(this.leftBtn);

    // 下一张按钮
    this.rightBtn = document.createElement('img');
    this.rightBtn.className = 'right-btn';
    this.rightBtn.src = '../img/right.png';
    if(this.imgArr.length === 1) {
      this.leftBtn.style.display = 'none';
      this.rightBtn.style.display = 'none';
    }
    this.swiperListDom.appendChild(this.rightBtn);
  }

  // 点击上一张照片
  prevSlider(aniTime) {
    if(this.imgArr.length === 1) return ;
    this.mainDom.style.transition = `left ${aniTime / 1000}s`;
    this.mainDom.style.left = `${parseInt(this.mainDom.style.left) + this.moveWidth}px`;
    if(this.nowIndex === 0) {
      this.nowIndex = this.imgArr.length - 1;
      // this.activeSpot();
      this.setActiveSpot();
      setTimeout(() => {
        this.mainDom.style.transitionProperty = 'none';
        this.mainDom.style.left = `${-this.imgArr.length * this.moveWidth}px`;
      }, aniTime);
    } else {
      this.nowIndex --;
      this.setActiveSpot();
    }
  }

  // 点击下一张图片
  nextSlider(aniTime) {
    if(this.imgArr.length === 1) return ;
    this.nowIndex ++;
    this.mainDom.style.transition =  `left ${aniTime / 1000}s`;
    this.mainDom.style.left = `${parseInt(this.mainDom.style.left) - this.moveWidth}px`;
    if(this.nowIndex === this.imgArr.length) {
      this.nowIndex = 0;
      this.setActiveSpot();
      setTimeout(() => {
        this.mainDom.style.transitionProperty = 'none';
        this.mainDom.style.left = `${-this.moveWidth}px`;
      }, aniTime)
    }else {
      this.setActiveSpot();
    }
  }

  setActiveSpot() {
    for(let i = 0; i < this.swiperSpotDom.childElementCount; i++) {
      if(i === Math.abs(this.nowIndex)) {
        document.getElementsByClassName('spot-item')[i].style.backgroundColor = '#ff5c1f';
      }else {
        document.getElementsByClassName('spot-item')[i].style.backgroundColor = '#ccc';
      }
    }
  }

  // 节流函数
  throttle(fn, delay=200) {
    let startTime = 0;
    return (...args) => {
      const nowTime = Date.now();
      if(nowTime - startTime >= delay) {
        fn(...args);
        startTime = nowTime();
      }
    }
  }
}