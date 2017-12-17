<template>
  <md-toolbar class=" md-dense " style="background-color:white; color: #ff720b;">
    <div id="route">
      <router-link class="header-link" tag="span" to="/bots" active-class="active">{{$lang.translate.header.my_bots}}</router-link>
      <router-link class="header-link" tag="span" to="/template" active-class="active">{{$lang.translate.header.bot_template}}</router-link>
      <router-link class="header-link" tag="span" to="/marketplace" active-class="active">{{$lang.translate.header.bot_marketplace}}</router-link>
    </div>
  </md-toolbar>
</template>

<script>
</script>

<style scooped>

.header-link {
  font-size: 20px;
  font-weight: 100;
  margin-left: 30px;
}
.active {
  border-bottom: 2px solid #f8bb15;
  color: #f8bb15
}
#route {
  margin-left: auto;
  margin-right: auto;
}
span {
    cursor: pointer;
    font-family: 'Roboto';
    font-size: 100%;
}
</style>
