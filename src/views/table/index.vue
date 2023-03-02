<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
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

      <el-table-column label="Operations" width="250">
        <template #default>
          <el-button
            link
            type="primary"
            size="small"
            @click="handleUpdate(row)"
          >查看</el-button>
          <el-button link size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->
        <el-form-item label="Title" prop="destination">
          <el-input v-model="temp.destination" />
        </el-form-item>
        <!-- <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item> -->
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoOutList } from '@/api/table'

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
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        destination: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      // getList().then(response => {
      //   this.list = response.data.items
      //   this.listLoading = false
      // })
      this.listLoading = true
      getGoOutList({ isGoHome: true }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
