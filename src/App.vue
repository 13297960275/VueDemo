<template>
    <div id="app">
        <router-view></router-view>
        <!-- <img src="./assets/logo.png"> -->
        <!-- demo
        <div>
            <hr>
            <h2>默认视图</h2>
            <router-view/>
            <hr>
            <h2>title命名视图</h2>
            <router-view name="title"></router-view>
            <hr>
            <h2>image命名视图</h2>
            <router-view name="img"></router-view>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    .left{
        width:20%;
        border: 1px solid gray;
        float: left;
    }
</style>
