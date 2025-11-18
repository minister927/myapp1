
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
export default function ImportXlsxFile() {
  



  const handleImport = async ({ file }: { file: File }) => {
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/xlsx-tool/import-xlsx', { method: 'POST', body: form });
      const json = await res.json();

      if (!res.ok) {
        message.error(json.details || json.error || '导入失败');
        return;
      }

      message.success(`成功导入 ${json.ok} 条订单，共 ${json.total} 条。`);
    } catch (error) {
      message.error('网络错误，请稍后再试。');
    }
  };

  return (
    <Upload >
      <Button icon={<UploadOutlined/>}>上传文件</Button>
    </Upload>
  );
}