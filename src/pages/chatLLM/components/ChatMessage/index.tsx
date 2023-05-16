import React, { Ref, useEffect, useMemo, useRef } from 'react'
import { copyToClipboard, joinTrim } from '@/utils'
import styles from './index.module.less'
import OpenAiLogo from '@/components/OpenAiLogo'
import { Space, Popconfirm, message, Button } from 'antd'

import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { DeleteOutlined, FormOutlined, ReloadOutlined, LikeOutlined, DislikeOutlined, CopyOutlined } from '@ant-design/icons'

function ChatMessage(props: {
  position: 'left' | 'right'
  content?: string
  status: 'pass' | 'loading' | 'error' | string
  time: string
  onDelChatMessage?: () => void
  reInput: (desc: string) => void
  reSend: () => void
}) {
  const { position,
    content,
    status,
    time,
    onDelChatMessage,
    reInput,
    reSend } = props
  const copyMessageKey = 'copyMessageKey'
  const markdownBodyRef = useRef<HTMLDivElement>(null)
  const copyBtnRef = useRef<HTMLDivElement>(null)

  /**
   * 
   * @param content 复制内容
   * @param copyBtnRef 复制触发元素
   * 不传content及copyBtnRef时，表示默认的复制ChatMessage中的markdown内容
   */
  function addCopyEvents(content?: string, copyBtnRef?: any) {
    const copyBtn = copyBtnRef?.current
    const copyEvent = (btn: any) => {
      btn.addEventListener('click', () => {
        const code = content || btn.parentElement?.nextElementSibling?.textContent
        if (code) {
          copyToClipboard(code)
            .then(() => {
              message.open({
                key: copyMessageKey,
                type: 'success',
                content: '复制成功'
              })
            })
            .catch(() => {
              message.open({
                key: copyMessageKey,
                type: 'error',
                content: '复制失败'
              })
            })
        }
      })
    }
    if (copyBtn) {
      copyEvent(copyBtn)
      copyBtn.click()
    } else {
      if (markdownBodyRef.current) {
        const copyBtn = markdownBodyRef.current.querySelectorAll('.code-block-header__copy')
        copyBtn.forEach(copyEvent)
      }
    }
  }

  function removeCopyEvents() {
    if (markdownBodyRef.current) {
      const copyBtn = markdownBodyRef.current.querySelectorAll('.code-block-header__copy')
      copyBtn.forEach((btn) => {
        btn.removeEventListener('click', () => {
          // ==== 无需操作 ====
        })
      })
    }
  }

  function highlightBlock(str: string, lang: string, code: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy" onclick="copyTextToClipboard('${code}')">复制代码</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
  }

  const mdi = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language))
      if (validLang) {
        const lang = language ?? ''
        return highlightBlock(hljs.highlight(code, { language: lang }).value, lang, code)
      }
      return highlightBlock(hljs.highlightAuto(code).value, '', code)
    }
  })

  mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
  mdi.use(mdKatex, { blockClass: 'katex-block', errorColor: ' #cc0000' })

  const text = useMemo(() => {
    const value = content || ''
    return mdi.render(value)
  }, [content])

  useEffect(() => {
    addCopyEvents()
    return () => {
      removeCopyEvents()
    }
  }, [markdownBodyRef.current])

  function chatAvatar({ icon, style }: { icon: string; style?: React.CSSProperties }) {
    return (
      <Space direction="vertical" style={{ textAlign: 'center', ...style }}>
        <img className={styles.chatMessage_avatar} src={icon} alt="" />
        {status === 'error' && (
          <Popconfirm
            title="删除此条消息"
            description="此条消息为发送失败消息，是否要删除?"
            onConfirm={() => {
              onDelChatMessage?.()
            }}
            onCancel={() => {
              // === 无操作 ===
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: 'red' }} />
          </Popconfirm>
        )}
      </Space>
    )
  }

  const reInputClick = (desc: string) => {
    reInput(desc)
  }

  const reSendClick = () => {
    reSend()
  }

  return (
    <div
      className={styles.chatMessage}
      style={{
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      {position === 'left' &&
        chatAvatar({
          style: { marginRight: 8 },
          icon: '/src/assets/gpt.svg'
        })}
      <div className={styles.chatMessage_content}>
        <span
          className={styles.chatMessage_content_time}
          style={{
            textAlign: position === 'right' ? 'right' : 'left'
          }}
        >
          {time}
        </span>
        <div
          className={joinTrim([
            styles.chatMessage_content_text,
            position === 'right' ? styles.right : styles.left
          ])}
        >
          {status === 'loading' ? (
            <OpenAiLogo rotate />
          ) : (
            <div>
              <div
                ref={markdownBodyRef}
                className={'markdown-body'}
                dangerouslySetInnerHTML={{
                  __html: text
                }}
              />
              {
                position === 'left' ? (
                  <div className={styles.handle_area}>
                    <div className={styles.handle_first_div}>
                      <Button type="text" icon={<ReloadOutlined />} onClick={reSendClick}>重新回答</Button>
                    </div>
                    <div>
                      <Button type="text" icon={<CopyOutlined />} onClick={() => addCopyEvents(content || '', copyBtnRef)} ref={copyBtnRef} />
                      <span className={styles.handle_middle_space} />
                      <Button type="text" icon={<LikeOutlined />} />
                      <span className={styles.handle_middle_space} />
                      <Button type="text" icon={<DislikeOutlined />} />
                    </div>
                  </div>
                )
                  : (
                  <div className={styles.handle_area}>
                    <Button type="text" icon={<FormOutlined />} onClick={() => reInputClick(content || '')}>重新输入</Button>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      {position === 'right' &&
        chatAvatar({
          style: { marginLeft: 8 },
          icon: '/src/assets/user.png'
        })}
    </div>
  )
}

export default ChatMessage
