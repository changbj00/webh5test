<template>
  <div class="hello">
    <img src="../assets/logo.jpeg">
    <h1 align="center">商家回调平台</h1>
    <br/>
    <div>
      <Form ref="userdata" :model="userdata" :rules="ruleValidate" :label-width="80">
        <FormItem label="borrowId" prop="borrowId">
          <Input v-model="userdata.borrowId" placeholder="请输入borrowId">
          <Icon type="ios-leaf" slot="prepend"/>
          </Input>
        </FormItem>
        <FormItem label="pid" prop="pid">
          <Input v-model="userdata.pid" placeholder="请输入pid">
          <Icon type="ios-jet" slot="prepend"/>
          </Input>
        </FormItem>
        <FormItem label="uid" prop="uid">
          <Input v-model="userdata.uid" placeholder="请输入uid">
          <Icon type="ios-ionitron" slot="prepend"/>
          </Input>
        </FormItem>
        <FormItem label="status" prop="status">
          <Input v-model="userdata.status" placeholder="请输入status">
          <Icon type="ios-notifications" slot="prepend"/>
          </Input>
        </FormItem>
        <FormItem label="nextPage" prop="nextPage">
          <Select v-model="userdata.nextPage" placeholder="请选择nextPage">
            <Option value="10071">确认借款</Option>
            <Option value="10084">放款中</Option>
            <Option value="10082">审核中</Option>
            <Option value="10081">还款详情</Option>
          </Select>
        </FormItem>
        <FormItem label="环境" prop="environment">
          <Select v-model="userdata.environment" placeholder="请选择环境">
            <Option value="d1">日常1套</Option>
            <Option value="d2">日常2套</Option>
            <Option value="d3">日常3套</Option>
            <Option value="d4">日常4套</Option>
            <Option value="mrongshu">生产环境</Option>
          </Select>
        </FormItem>
        <FormItem label="回调链接" prop="backurl">
          <Select v-model="userdata.backurl" placeholder="请选择回调链接">
            <Option value="cashBack">提现结果</Option>
            <Option value="bindCardBack">绑卡结果</Option>
            <Option value="contractBack">签约结果</Option>
            <Option value="repaytext">还款结果</Option>
            <Option value="operatorBack">数据认证</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button align="center" type="primary" long @click="Submit('userdata')">确认回调</Button>
          <span @click="check">查询数据</span>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js"
const CRYPTOJSKEY= "A91DBAB64154FE7A640E89E0089F0A1E"
export default {
  name: 'HelloWorld',
  data () {
    return {
      userdata: {
        borrowId: '',
        pid: '',
        uid: '',
        status: '',
        nextPage: '',
        environment: '',
        backurl: '',
      },
      ruleValidate: {
        borrowId: [
          { required: true, message: '请输入borrowId', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请输入pid', trigger: 'blur' }
        ],
        uid: [
          {required: true, message: '请输入uid', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请输入status', trigger: 'blur'}
        ],
        environment: [
          { required: true, message: '请选择环境', trigger: 'change' }
        ],
        backurl: [
          { required: true, message: '请选择回调链接', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    Submit (name) {
      var borrowid=this.encrypt(this.userdata.borrowId)
      var timestamp=new Date().getTime()
      this.$refs[name].validate((valid) => {
        console.log(valid)

        if (valid) {
          var url='https://'+this.userdata.environment+'.shurongdai.cn/rongshu/src/p/'+this.userdata.backurl+'/index.html?'
            +'pid='+this.userdata.pid+'&borrowId='+borrowid+'&timestamp='+timestamp+'&status='
            +this.userdata.status+'&nextPage='+this.userdata.nextPage+'&wallet=0&GRAY'
          if (this.userdata.backurl==='cashBack') {
            this.$Message.info('暂无提现回调页，先跳百度!')
            window.location.href='http://www.baidu.com'
          } else if(this.userdata.backurl==='bindCardBack') {
            url=url+'&cardType=1&bankCardId=-1'
            window.location.href=url
          }else if(this.userdata.backurl==='operatorBack') {
            url=url+'&isDataAuth=1'
            window.location.href=url
          }else {
            window.location.href=url
          }

            console.log(url)
        } else {
          this.$Message.error('请检查后重新输入!')
        }
      })
    },
    check (){
      this.$router.push('/check')
    },
    encrypt(borrowid) {
      var options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      };
      var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
      var encryptedData = CryptoJS.AES.encrypt(borrowid, key, options);
      var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
      encryptedBase64Str = encryptedBase64Str.replace(/\+/g,"-");
      return encryptedBase64Str;
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    width: 300px;
    margin-top: 0px;
    margin-left: 0px;
  }
  h1{
    font-weight: normal;
    margin: auto;
  }
  span{
    cursor: pointer;
  }
  span:hover{
    color: green;
  }
  img{
    width: 20%;
    height: 20%;
  }
</style>
