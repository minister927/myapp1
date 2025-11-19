'use client'

import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

export default function ImportXlsxFile() {
  

  const props: UploadProps = {
  name: 'file',
  action: '/api/xlsx-tool/import-xlsx',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`); 
    }
  },
};



  // const handleImport = async ({ file }: { file: File }) => {
  //   const form = new FormData();
  //   form.append('file', file);

  //   try {
  //     const res = await fetch('/api/xlsx-tool/import-xlsx', { method: 'POST', body: form });
  //     const json = await res.json();

  //     if (!res.ok) {
  //       message.error(json.details || json.error || '导入失败');
  //       return;
  //     }

  //     message.success(`成功导入 ${json.ok} 条订单，共 ${json.total} 条。`);
  //   } catch (error) {
  //     message.error('网络错误，请稍后再试。');
  //   }
  // };

  return (
    // 可追加属性
     <Upload {...props} >
      <Button icon={<UploadOutlined/>}>上传文件</Button>
    </Upload>
  );
}