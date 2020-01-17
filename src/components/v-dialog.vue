<template>
      <el-dialog :title="title" :visible.sync="dialogVisible" :append-to-body="appendToBody" :width="width">
          <slot></slot>

          <div slot="footer" class="dialog-footer">
          <slot name="footer" ></slot>
          </div>
      </el-dialog>
</template>

<script>
import Vue from 'vue';
export default {
  name:'vDialog',
  props: {
    appendToBody:{
      type: Boolean,
      required: false,
      default:false
    },
    title: {
      type: String,
      default: "提示",
      required: false
    },
    width: {
      type: String,
      required: false,
      defult: "50%"
    },
  },
  data() {
    return {
      params:{},
      dialogVisible: false
    };
  },
  methods: {
    getComponent(){
      let comSlots = this.$slots['default'];
      if(comSlots&&comSlots.length>0){
        return comSlots[0].componentInstance;
      }
      throw new Error('SLOT为空')
    },
    init(params={}){
      this.params = params;
      let instance = this.getComponent();
      instance&&instance.$emit('init',this.params)
    },
    show(params={}) {
      this.dialogVisible = true;
      this.$nextTick(()=>{
        this.init(params)
      })
    },
    dispatch(eventName,data){
      let instance = this.getComponent();
      instance&&instance.$emit(eventName,data)
    },
    hide() {
      this.dialogVisible = false;
    }
  }
};
</script>