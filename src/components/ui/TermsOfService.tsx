import React from "react";
import style from "@/pages/Login/Auth.module.css";

interface TermsOfServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ visible, onClose }) => {
  if (!visible) return null; // 不可见时不渲染

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' // 优化移动端滚动
      }}
      onClick={onClose} // 点击遮罩层关闭
    >
    
      

      <div 
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          width: '80%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          margin: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          animation: 'fadeIn 0.3s ease-out' // 淡入动画
        }}
        onClick={(e) => e.stopPropagation()} // 点击内容区不关闭
      >
        <button 
            style={{
              color: 'rgba(25, 114, 239, 0.6)',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              float: 'right',
              transition: 'background-color 0.2s',
              marginLeft: 'left',
              display: 'block' // 块级元素便于布局
            }}
            onClick={onClose}
          >
            关闭
          </button>
        <h2 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: 'black' 
        }}>服务条款</h2>

        <div style={{ lineHeight: '1.8', marginBottom: '1.5rem', color: 'black' }}>
          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>一、总则</div>
          <p style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            color: 'black' 
          }}>
            欢迎您使用 MUNDO（以下简称“本论坛”）！本论坛致力于为用户提供安全、有序的交流环境。请您在使用本论坛服务前，仔细阅读并充分理解本服务条款的全部内容。若您不同意本条款的任何内容，或对条款存在疑问，应立即停止使用本论坛服务。
          </p>

          <p style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            color: 'black' 
          }}>
            本服务条款将涵盖以下内容：
          </p>

          <ol style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside", 
            color: 'black' 
          }}>
            <li>用户权利与义务</li>
            <li>服务使用规范</li>
            <li>知识产权条款</li>
            <li>责任限制与免责声明</li>
            <li>条款更新与终止</li>
            <li>争议解决</li>
          </ol>

          <p style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            color: 'black' 
          }}>
            本条款适用于您通过任何方式访问和使用本论坛的服务，包括网页端、移动端应用程序等。
          </p>

          {/* 用户权利与义务 */}
          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>二、用户权利与义务</div>
          <ul style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside", 
            color: 'black' 
          }}>
            <li>您有权在遵守本条款的前提下自由使用论坛提供的各项服务，包括但不限于发布内容、参与讨论、关注其他用户等。</li>
            <li>您需保证注册时提供的信息真实、准确、完整，并及时更新个人信息。若因信息不实导致的一切后果，由您自行承担。</li>
            <li>未成年人使用本论坛服务应事先取得监护人的同意，并在监护人指导下使用。</li>
          </ul>

          {/* 服务使用规范 */}
          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>三、服务使用规范</div>
          <ul style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside", 
            color: 'black' 
          }}>
            <li>禁止发布违反法律法规、公序良俗的内容，包括但不限于色情、暴力、恐怖主义、仇恨言论等。</li>
            <li>不得利用论坛服务从事非法活动，或干扰、破坏论坛的正常运营秩序。</li>
            <li>尊重他人知识产权，不得抄袭、剽窃他人作品，或未经授权使用他人商标、专利等。</li>
          </ul>

          {/* 知识产权条款 */}
          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>四、知识产权条款</div>
          <ul style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside", 
            color: 'black' 
          }}>
            <li>本论坛的所有内容（包括但不限于文字、图片、音频、视频、软件等）均受知识产权法律保护，未经本论坛书面许可，不得擅自复制、传播、修改或用于商业用途。</li>
            <li>您在论坛发布的内容，视为授予本论坛非独家的、全球性的、永久的、可再许可的使用权，本论坛有权在合理范围内使用、展示、推广您的内容。</li>
          </ul>

          {/* 责任限制与免责声明 */}
          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>五、责任限制与免责声明</div>
          <ul style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside", 
            color: 'black' 
          }}>
            <li>本论坛仅提供信息发布与交流平台，对用户发布的内容不承担审查义务，亦不就其真实性、准确性负责。</li>
            <li>因不可抗力、网络故障、第三方行为等原因导致服务中断或数据丢失的，本论坛不承担赔偿责任，但将尽力减少损失并及时恢复服务。</li>
          </ul>

          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>六、条款更新与终止</div>
          <ul style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside", 
            color: 'black' 
          }}>
            <li>本论坛有权根据业务发展需要更新本条款，更新后的条款将在论坛显著位置公布。若您继续使用服务，视为接受新条款。</li>
            <li>若您违反本条款，本论坛有权采取警告、限制功能、封禁账号等措施。账号封禁后，您的历史数据可能被删除且无法恢复。</li>
          </ul>

          <button 
            style={{
              color: 'rgba(25, 114, 239, 0.6)',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              float: 'right',
              transition: 'background-color 0.2s',
              marginLeft: 'auto', // 确保按钮靠右
              display: 'block' // 块级元素便于布局
            }}
            onClick={onClose}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceModal;