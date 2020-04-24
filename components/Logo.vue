<template>
  <div class="VueToNuxtLogo">
    <!-- <div class="Triangle Triangle--two" />
    <div class="Triangle Triangle--one" />
    <div class="Triangle Triangle--three" />
    <div class="Triangle Triangle--four" /> -->
    <img
      class="Virus"
      alt="Virus"
      src="/virus.svg"
    >
  </div>
</template>

<style>



.logo-wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;
  height: 180px;
  width: 245px;
  top:-50px;
  animation: bounce 1s linear forwards 0.5s;
}

@keyframes bounce {
  0% {
    transform: translate3d(0, -50px, 0) scaleY(1);
  }
  10% {
    transform: translate3d(0, 0px, 0) scaleY(1) rotateZ(15deg);
  }
  25% {
    transform: translate3d(0, 60px, 0) scaleY(1);
  }
  40% {
    transform: translate3d(0, 120px, 0) scaleY(1) rotateZ(-15deg);
  }
  50% {
    transform: translate3d(0, 180px, 0) scaleY(1);
  }
  55% {
    transform: translate3d(0, 170px, 0) scaleY(0.57) rotateZ(15deg);
  }
  60% {
    transform: translate3d(0, 140px, 0) scaleY(0.8);
  }
  75% {
    transform: translate3d(0, 80px, 0) scaleY(1) rotateZ(-15deg);
  }
  90% {
    transform: translate3d(0, 60px, 0) scaleY(1);
  }
  100% {
    transform: translate3d(0, 50px, 0) scaleY(1) rotateZ(0deg);
  }
}


.coronavirus-svg {
  max-width: 100%;
  max-height: 100%;
}

.VueToNuxtLogo {
  display: inline-block;
  animation: turn 2s linear forwards 1s;
  transform: rotateZ(180deg);
  position: relative;
  overflow: hidden;
  top: 20%;
  height: 180px;
  width: 245px;
}
/* 
.Triangle {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.Triangle--one {
  border-left: 105px solid transparent;
  border-right: 105px solid transparent;
  border-bottom: 180px solid #41b883;
}

.Triangle--two {
  top: 30px;
  left: 35px;
  animation: goright 0.5s linear forwards 3.5s;
  border-left: 87.5px solid transparent;
  border-right: 87.5px solid transparent;
  border-bottom: 150px solid #3b8070;
}

.Triangle--three {
  top: 60px;
  left: 35px;
  animation: goright 0.5s linear forwards 3.5s;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-bottom: 120px solid #35495e;
}

.Triangle--four {
  top: 120px;
  left: 70px;
  animation: godown 0.5s linear forwards 3s;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 60px solid #fff;
}

@keyframes turn {
  100% {
    transform: rotateZ(0deg);
  }
}

@keyframes godown {
  100% {
    top: 180px;
  }
}

@keyframes goright {
  100% {
    left: 70px;
  }
}
*/
.Virus {
  height:180px;
  width: 180px;
  transform: rotateY(560deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
