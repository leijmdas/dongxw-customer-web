<template>
  <fieldset>
    <legend :action-type="entity.id ? 2 : 1">信息编辑</legend>
      <el-form :model="entity" :rules="rules" ref="form" label-width="100px" >
         <el-form-item label="工号" prop="employeeNo">
          <el-input v-model="entity.employeeNo" placeholder="不可修改" :readonly="entity.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="sysAccount.realName">
          <el-input v-model="entity.sysAccount.realName"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="orgId">
          <org-tree v-model="entity.orgId" :corp-id="entity.corpId" style="width: 100%;"></org-tree>
        </el-form-item>
        <el-form-item label="联系电话" prop="sysAccount.telNo">
          <el-input v-model="entity.sysAccount.telNo" :disabled="!!entity.id"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="entity.email"></el-input>
        </el-form-item>
        <!--<el-form-item label="联系地址" prop="manHour">-->
          <!--<el-input v-model="entity.manHour"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="entity.status">
            <el-radio v-for="item in $dict.store.STATUS" :key="item[0]" :label="item[0]">{{item[1]}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="entity.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" v-keycode="'altS'">保存(S)</el-button>
          <el-button  @click="resetForm" v-keycode="'altR'">重置(R)</el-button>
        </el-form-item>
      </el-form>
  </fieldset>
</template>
<script>
  import  RepairItemTypeSelect from '../../../components/widgets/RepairItemTypeSelect'
  import OrgTree from '../../../components/widgets/OrgTree'
  import {fetch} from '@/utils'

  const defaultEntity = {
    id:undefined,
    corpId:1,
    employeeNo:null,
    orgId:0,
    status:1,
    remark:'',
    sysAccount: {
      realName: undefined,
      telNo: undefined
    }
  }
  export default {
    components:{RepairItemTypeSelect, OrgTree},
    data() {
      return {
        entity: _.cloneDeep(defaultEntity),
        types:[],
        rules: {
          employeeNo: [
            { required: true, message: '请输入工号', trigger: 'blur' },
          ],
          'sysAccount.realName': [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          orgId:[
            { required: true, message: '请输入工时标准', trigger: 'blur' }
          ],
          'sysAccount.telNo':[
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ],
          status:[
            { type: 'number',required: true, message: '请选择状态', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      setValues(vals){
        this.resetEntity = _.cloneDeep(vals);
        this.entity = _.cloneDeep(this.resetEntity)
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            fetch.sys.User.save(this.entity).then((rsp)=>{
              this.$emit('saved',rsp)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['form'].resetFields()
        this.resetEntity = _.cloneDeep(defaultEntity)
        this.entity = _.cloneDeep(this.resetEntity)
      },
      init(options){
        this.resetForm()
        if(options.id){
          fetch.sys.User.get(options.id).then(rsp=>{
            this.entity = rsp
          })
        }
      }
    }
  }
</script>
