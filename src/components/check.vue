<template>
  <div>
    <div class="check">
      <img class="logo" src="../assets/logo.jpeg">
      <h1>查询数据</h1>
      <br/>
      <Form ref="casedata" :model="casedata" :rules="ruleValidate" :label-width="80">
        <FormItem label="数据库" prop="database">
          <Select v-model="casedata.database" placeholder="请选择database">
            <Option value="hermes">hermes</Option>
            <Option value="orion">orion</Option>
            <Option value="spore">spore</Option>
            <Option value="showengines">showengines</Option>
            <Option value="brsender">brsender</Option>
            <Option value="thinker">thinker</Option>
            <Option value="groot">groot</Option>
            <Option value="market">market</Option>
            <Option value="dragonfly">dragonfly</Option>
          </Select>
        </FormItem>
        <FormItem label="查询方式" prop="type">
          <Select v-model="casedata.type" placeholder="请选择查询方式">
            <Option value="sql">按sql查询</Option>
            <Option value="key-value">按key，value查询</Option>
          </Select>
        </FormItem>
        <form v-if="casedata.type==='key-value'">
            <p style="font-size: small;color: #f5222d">如查询多个key，value使用英文逗号分隔！</p>
          <FormItem label="查询表" prop="table">
            <Input v-model="casedata.table" placeholder="请输入要查询的表">
            </Input>
          </FormItem>
          <FormItem label="key" prop="key">
            <Input v-model="casedata.key" placeholder="请输入要查询的key">
            </Input>
          </FormItem>
          <FormItem label="value" prop="value">
            <Input v-model="casedata.value" placeholder="请输入要查询的value">
            </Input>
          </FormItem>
        </form>
        <FormItem v-if="casedata.type==='sql'" label="sql" prop="sql">
          <Input v-model="casedata.sql" type="textarea" :autosize="true" placeholder="请输入要查询的sql">
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="Submit('casedata')">查询数据</Button>
          <span @click="callback">返回</span>
        </FormItem>
      </Form>
    </div>
    <div>
      <Table v-show="data2.length>0" border width="auto" :columns="columns" :data="data2"></Table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "check",
    data() {
      return {
        casedata: {
          database: '',
          key: '',
          value: '',
          table: '',
          type: '',
          sql: ''
        },
        columns:
          [],
        data2: [],
        ruleValidate: {
          database: [
            {required: true, message: '请选择database', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择查询方式', trigger: 'change'}
          ],
          key: [
            {required: true, message: '请输入要查询的key', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '请输入要查询的value', trigger: 'blur'}
          ],
          table: [
            {required: true, message: '请输入要查询的表', trigger: 'blur'}
          ],
          sql: [
            {required: true, message: '请输入要查询的sql', trigger: 'blur'}
          ]

        }
      }
    },
    methods: {
      Submit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            var url = '/jdbc/' + this.casedata.database
            if (this.casedata.type !== 'sql') {
              this.casedata.sql=''
            }
            console.log(this.casedata)
              this.$axios.post(url, this.casedata).then(res => {
                console.log(url)
                if (res.data) {
                console.log(res,res.data.length,res.data.type)
                if (res.data.length === 0) {
                  this.data2=res.data
                  this.$Message.error('查询结果为空，请确认后再查！！')
                } else if (typeof res.data!=='string'&& res.data.length>0) {
                  let columns = Object.keys(res.data[0]).map(key => {
                    return {
                      title: key,
                      key: key,
                      minWidth: 80
                    }
                  })
                  columns[0].fixed = 'left'
                  columns[columns.length - 1].fixed = 'right'
                  this.columns = columns;
                  this.data2 = res.data
                }else {
                  this.$Message.error(res.data)
                  //this.data2=undefined
                }}
              }).catch(err => {
                console.log(err)
                this.$Message.error('查询错误，请联系程序开发人员！！')
              })

          } else {
            this.$Message.error('请检查后重新输入!');
          }
        })
      },
      callback() {
        this.$router.back()
      }
    }
  }
</script>

<style>
  .check {
    width: 300px;
    margin: 0 auto;
  }

  h1 {
    font-weight: normal;
  }

  span {
    cursor: pointer;
  }

  span:hover {
    color: green;
  }

  .logo {
    height: 20%;
    width: 20%;
    margin-top: 10px;
  }

  /*调整table cell间隔和行高*/
  .ivu-table-cell td {
    padding-left: 1px;
    padding-right: 1px;
    overflow: auto;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    box-sizing: border-box;
    height: 60px;
  }

  .ivu-table-small td {
    height: 30px;
  }
</style>
