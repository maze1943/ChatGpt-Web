import { useEffect } from 'react';
import styles from './index.module.less';
import configJson from '@@/config.json';
import robotPNG from '@/assets/robot.png';
import videoPNG from '@/assets/video.png';
import documentPNG from '@/assets/document.png';
import codePNG from '@/assets/code.png';
import { Button } from 'antd';

function Reminder(props: any) {

    const list = [
        {
            icon: robotPNG,
            name: '职场助理',
            desc: '作为手机斗地主游戏的产品经理，该如何做成国内爆款？'
        },
        {
            icon: videoPNG,
            name: '电影脚本',
            desc: '写一段电影脚本，讲一个北漂草根创业逆袭的故事'
        },
        {
            icon: documentPNG,
            name: '撰写短文',
            desc: '写一篇短文，用故事阐释幸福的意义'
        },
        {
            icon: codePNG,
            name: '代码编写',
            desc: '使用JavaScript写一个获取随机数的函数'
        },
        {
            icon: codePNG,
            name: '代码编写1',
            desc: '使用JavaScript写一个获取随机数的函数'
        }
        , {
            icon: codePNG,
            name: '代码编写2',
            desc: '使用JavaScript写一个获取随机数的函数'
        }
    ]

    const tryreminder = (reminderDesc: string) => {
        props.getReminderDesc(reminderDesc)
    }

    useEffect(() => {
        console.log(configJson)
    })

    return (
        <div className={styles.reminder}>
            <div className={styles.first_reminder}>
                <h2 className={styles.reminder_title}><img src="https://www.imageoss.com/images/2023/04/23/robot-logo4987eb2ca3f5ec85.png" alt="" />您好，我是 {import.meta.env.VITE_APP_TITLE}</h2>
                {
                    configJson.projectInfo.description.map((desc: string) => <p key={desc} className={styles.reminder_message}>{desc}</p>)
                }
                <p className={styles.reminder_message}><span>Shift</span> + <span>Enter</span> 换行，开头输入 <span>/</span> 可选择角色预设</p>
            </div>
            <div className={styles.second_reminder}>
                <p className={styles.reminder_remind}>你可以试着问我：</p>
                <div className={styles.reminder_question}>
                    {
                        list.map((item) => {
                            return (
                                <div key={item.name} className={styles.reminder_question_item}>
                                    <p className={styles.reminder_role}>
                                        <img src={item.icon} alt="" /><span className={styles.reminder_role}>{item.name}</span>
                                    </p>
                                    <p>{item.desc}</p>
                                    <Button className={styles.reminder_button} onClick={() => tryreminder(item.desc)}>试一试</Button>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    );
}

export default Reminder;
