'use client'
import { useRouter } from 'next/navigation';
import {Card, Form, Button, Input, message } from 'antd';

type FormValue = {
    username: string;
    password: string;
};


export default function LoginForm() {
    const router = useRouter();

    const onFinish = async (values :FormValue) =>{//成功时用以跳转页面
       try{
           const res = await fetch('/api/login',{//POST请求用以像后端接口发送数据，将用户登录信息values,await res等待请求回应对象，后续可使用
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },//告诉后端“我发的是 JSON 格式的文本”。
                body: JSON.stringify(values),//把表单收集到的对象（序列化成 JSON 字符串，放在请求体里传过去。
           })

           const data = await res.json();//将回应的数据解析，不可直接使用res
           if (res.ok && data.ok) {
            message.success('登录成功');
            router.push('/admin/dashboard'); // 跳转到后台首页
          } else {
            message.error(data.message || '登录失败');
          }

       }catch(err){
        message.error('网络错误');
       }
    } 

    return (
        <div  className="login-form pt-20">
            <Card title="Next全栈管理系统后台" className=" bg-red-500 w-4/5 mx-auto mt-20">
            <Form 
                labelCol={{span:1}}
                onFinish={ onFinish} 
               > 
                <Form.Item name="username"  label='用户名'>
                    <Input placeholder= '请输入用户名' />
                </Form.Item>
                <Form.Item name="password"  label='密码'>
                    <Input.Password placeholder= '请输入密码' />
                </Form.Item>
                <Form.Item >
                    <Button  block type='primary' htmlType='submit'>登录</Button>
                </Form.Item>
            </Form>
            </Card>
           
        </div>    
    );
}