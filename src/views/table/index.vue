<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        Add
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      style="width: 100%;"
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>

      <el-table-column width="110" label="目的地">
        <template slot-scope="{row}">
          {{ row.destination }}
        </template>
      </el-table-column>

      <el-table-column label="同行人" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.partnerInfo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="计划" align="center">
        <template slot-scope="{row}">
          {{ row.plan }}
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="是否已回家" width="110" align="center">
        <template slot-scope="{row}">
          <span v-if="row.isGoHome">是</span>
          <span v-if="!row.isGoHome">否</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="更新时间" width="200">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | formatDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="预计回家时间" width="200">
        <template slot-scope="{row}">
          <span>{{ row.estimatedHomeTime | formatDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="实际回家时间" width="200">
        <template slot-scope="{row}">
          <span>{{ row.realHomeTime | formatDateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          {{ row.remark }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template slot-scope="{row}">
          <el-button
            link
            size="small"
            @click="handleUpdate(row)"
          >查看</el-button>
          <el-button link size="small" type="primary" @click="popUpGoHomeDialog(row)">已到家</el-button>
          <el-button link size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button link type="danger" size="small" @click="deleteGoOutDialog(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 800px; margin-left:50px;">
        <!-- <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="目的地" prop="destination">
          <el-input v-model="temp.destination" />
        </el-form-item>
        <el-form-item label="同行人" prop="partnerInfo">
          <el-input v-model="temp.partnerInfo" type="textarea" />
        </el-form-item>
        <el-form-item label="出行计划" prop="plan">
          <el-input v-model="temp.plan" type="textarea" />
        </el-form-item>
        <el-form-item label="是否已回家" prop="isGoHome">
          <el-switch v-model="temp.isGoHome" />
        </el-form-item>
        <el-form-item label="预计回家时间" prop="estimatedHomeTime">
          <el-date-picker v-model="temp.estimatedHomeTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="实际回家时间" prop="realHomeTime">
          <el-date-picker v-model="temp.realHomeTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <!-- <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          返回
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="goHomeDialog">
      <el-form ref="goHomeDialogRef" :rules="goHomeNowRules" :model="temp" label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item label="实际回家时间" prop="realHomeTime">
          <el-date-picker v-model="temp.realHomeTime" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goHomeDialog = false">
          返回
        </el-button>
        <el-button type="primary" @click="goHomeNow()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoOutList, updateGoOut, goHomeNow, deleteGoOut, createGoOut } from '@/api/goOut'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      textMap: {
        update: '编辑',
        create: '新建',
        goHomeNow: '已到家'
      },
      temp: {
        id: undefined,
        createTime: '',
        updateTime: '',
        destination: '',
        partnerInfo: '',
        estimatedHomeTime: '',
        isGoHome: false,
        realHomeTime: '',
        plan: '',
        remark: ''
      },
      dialogFormVisible: false,
      rules: {
        estimatedHomeTime: [{ required: true, message: '必填', trigger: 'change' }],
        destination: [{ required: true, message: '必填', trigger: 'change' }],
        plan: [{ required: true, message: '必填', trigger: 'change' }]
      },
      goHomeNowRules: {
        realHomeTime: [{ required: true, message: '必填', trigger: 'change' }]
      },
      dialogStatus: '',
      goHomeDialog: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getGoOutList({ isGoHome: null }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        createTime: '',
        updateTime: '',
        destination: '',
        partnerInfo: '',
        estimatedHomeTime: '',
        isGoHome: false,
        realHomeTime: '',
        plan: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createGoOut(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateGoOut(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    popUpGoHomeDialog(row) {
      this.dialogStatus = 'goHomeNow'
      this.goHomeDialog = true
      this.temp = row
      this.temp.realHomeTime = new Date()
    },
    goHomeNow() {
      this.$refs['goHomeDialogRef'].validate((valid) => {
        if (valid) {
          const tempData = {}
          tempData.id = this.temp.id
          tempData.realHomeTime = this.temp.realHomeTime
          goHomeNow(tempData).then(() => {
            this.goHomeDialog = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    deleteGoOutDialog(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoOut({ id: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).finally(() => {
          this.fetchData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
