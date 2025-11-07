// src/app/page.tsx
'use client'
import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const HomePage = () => (
  <div>
    <Title level={2} children="欢迎使用后台管理系统" />
    <p>请从左栏选择功能模块。</p>
  </div>
);

export default HomePage;