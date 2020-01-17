<template>
  <div class="dialog-container">
    <el-dialog
      title="title"
      :visible.sync="visible"
      @close="$emit('update:show', false)"
      :show="show">
      <span>this is a dialog.</span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: this.show
      };
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      show () {
        this.visible = this.show;
      }
    }
  };
</script>
