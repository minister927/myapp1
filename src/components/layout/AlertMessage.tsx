//可用于显示提示信息，用法 ： setAlert({ level: 'error', title: '登录失败', desc: data.message || '用户名或密码错误', closable: true });
                            // <AlertMessage tips={alert} />
import React from 'react';
import { Alert } from 'antd';

type Level = 'success' | 'info' | 'warning' | 'error';

export interface AlertTips {
  level?: Level;      // 颜色类型
  title?: string;     // 简短标题（对应 Alert 的 message）
  desc?: string;      // 详细描述（对应 Alert 的 description）
  closable?: boolean; // 是否显示关闭按钮
  showIcon?: boolean; // 是否显示图标
}

export default function AlertMessage({ tips }: { tips?: AlertTips }) {
  // 没有提示或空对象时不渲染
  if (!tips || (!tips.title && !tips.desc)) return null;

  const {
    level = 'info',
    title = '',
    desc = '',
    closable = false,
    showIcon = true,
  } = tips;

  return (
    <Alert
      message={title || undefined}
      description={desc || undefined}
      type={level}
      showIcon={showIcon}
      closable={closable}
      className="mb-4"
    />
  );
}