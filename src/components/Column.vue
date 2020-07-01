<template>
  <div class="col-12 col-lg-4 padlr5">
    <div class="dcos-column">
      <slot name="widgets">
        <dynamic-widget v-for="(widget, index) in widgets" :key="widget.name + index" :widget="widget"></dynamic-widget>
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'column',
    props: {
      widgets: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
<style>

</style>
