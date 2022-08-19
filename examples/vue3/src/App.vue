<template>
  <div class="my-image" id="myImage"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import rain from 'rainy-window'

onMounted(() => {
rain('myImage', 'http://pic.zhangshichun.top/pic/20220606-02.jpg')
})

</script>

<style>
.my-image {
  width: 600px;
  height: 500px;
}
</style>
