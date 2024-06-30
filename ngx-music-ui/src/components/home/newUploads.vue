<script setup lang="ts">
import dummyData from "@/dummyData.json"
import {onMounted, ref, watch} from "vue";

const buttonIsHover = ref<boolean>(false)
const sliderContainer = ref<HTMLElement>()
const sliderPosition = ref<number>(0)

// const triggerPeekAnimation = () => {
//   buttonIsHover.value = true
//   setTimeout(() => {
//     buttonIsHover.value = false
//   }, 1600)
// }

onMounted(() => {
})

watch(sliderPosition, () => {
  sliderContainer.value!.style.transform = `translateX(${sliderPosition.value}px)`
})

const moveSliderForward = () => {
  if (sliderPosition.value <= -1800) {
    sliderPosition.value = -1800
  } else {
    sliderPosition.value -= 400
  }
}
const moveSliderBackward = () => {
  if (sliderPosition.value >= 1800) {
    sliderPosition.value = 1800
  } else {
    sliderPosition.value += 400
  }
}

onMounted(() => {
  console.log(sliderContainer.value)
})


</script>

<template>
  <div class="new-uploads-box">
    <h1 class="text-white font-bold text-2xl uppercase">New Upload</h1>
    <div class="new-tracks-container">
      <div class="new-tracks-second-container sliderpeek" id="newTrackSlider" ref="sliderContainer">
        <div class="track-box" v-for="newUploadData of dummyData">
          <img class="artwork-img" src="@/assets/118490595_p0.jpg" alt="artwork">
          <p class="text-white font-bold text-[1.15rem]">{{ newUploadData.trackTitle }}</p>
          <p class="text-white text-[0.90rem]">{{ newUploadData.trackArtis }}</p>
        </div>
      </div>
    </div>
    <div class="slider-button-box-forward">
      <div class="flex items-center h-full">
        <button type="button" @click="moveSliderForward" class="slider-button"><i class="text-white fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
    <div class="slider-button-box-backward">
      <div class="flex items-center h-full">
        <button type="button" @click="moveSliderBackward" class="slider-button"><i class="text-white fa-solid fa-arrow-left"></i></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-uploads-box {
  @apply relative
}
.slider-button {
  @apply my-auto px-3 py-2 bg-gray-950 rounded
}
.slider-button-box-forward {
  @apply absolute h-full p-1 top-0 right-0
}
.slider-button-box-backward {
  @apply absolute h-full p-1 top-0 left-0
}

.track-box {
  width: 150px;
}

.new-tracks-container {
  @apply overflow-hidden relative
}

.new-tracks-second-container {
  @apply inline-flex mt-3 gap-3;
  transition: all 0.5s;
}

.sliderpeek {
  animation: sliderPeekIn 1.5s ease 1s;
}

@keyframes sliderPeekIn {
  0% {transform: translateX(0rem)}
  50% {transform: translateX(-5rem)}
  100% {transform: translateX(0rem)}

}

</style>