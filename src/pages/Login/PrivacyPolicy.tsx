import React from "react";
import { Link } from "react-router-dom";
import "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">

      {/* 主内容区 */}
      <main className="policy-content">
        <div className="policy-header">
          <h1 className="policy-title">隐私条款</h1>
          <div className="policy-meta">
            <span className="policy-date">最后更新：2023年10月1日</span>
            <Link to="/login" className="back-button">
              返回登录页
            </Link>
          </div>
        </div>

        <div className="policy-body">
          <section className="policy-section">
            <h2 className="section-title">一、总则</h2>
            <p className="section-content">
              本隐私条款旨在说明MUNDO平台如何收集、使用、存储和共享用户信息，以保护用户的合法权益。
              本平台尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，
              本平台会按照本隐私权政策的规定使用和披露您的个人信息。但本平台将以高度的勤勉、审慎义务对待这些信息。
              除本隐私权政策另有规定外，在未征得您事先许可的情况下，本平台不会将这些信息对外披露或向第三方提供。
              本平台会不时更新本隐私权政策。您在同意本平台服务使用协议之时，即视为您已经同意本隐私权政策全部内容。
              本隐私权政策属于本平台服务使用协议不可分割的一部分。
            </p>
          </section>

          <section className="policy-section">
            <h2 className="section-title">二、信息收集</h2>
            <p className="section-content">
              我们会收集用户的注册信息（如邮箱、手机号）、登录记录、使用行为数据等。
              当您注册MUNDO平台账户时，我们可能会要求您提供以下信息：姓名、电子邮件地址、手机号码、
              用户名、密码以及其他相关信息。这些信息对于创建和维护您的账户是必要的。
            </p>

            <section className="policy-subsection">
              <h3 className="subsection-title">2.1 主动提供的信息</h3>
              <p className="subsection-content">
                当您注册或使用平台服务时，您需要主动提供必要的个人信息。
                这些信息包括但不限于您在注册过程中提供的信息、您在使用我们的服务时
                提供的内容（如发布的问题、回答、评论等）、您与我们的客服团队沟通时提供的信息，
                以及您在平台上进行交易或参与活动时提供的信息。
              </p>
            </section>

            <section className="policy-subsection">
              <h3 className="subsection-title">2.2 自动收集的信息</h3>
              <p className="subsection-content">
                当您使用我们的服务时，我们可能会自动收集某些信息，包括但不限于：
                设备信息（如设备型号、操作系统版本、唯一设备标识符等）、
                日志信息（如您对我们服务的使用情况、访问时间、IP地址等）、
                位置信息（如果您允许我们收集）以及其他与您使用我们服务相关的信息。
              </p>
            </section>
          </section>

          <section className="policy-section">
            <h2 className="section-title">三、信息使用</h2>
            <p className="section-content">
              我们仅将收集的信息用于提供服务、优化产品体验及遵守法律法规。
              我们收集的您的个人信息将用于以下目的：
            </p>
            
            <ul className="policy-list">
              <li>提供和维护我们的服务，包括验证您的身份、处理您的请求、提供客户支持等</li>
              <li>改进我们的服务，包括分析您的使用情况、开展研究和调查等</li>
              <li>个性化您的体验，包括提供定制化的内容推荐、服务和广告等</li>
              <li>与您沟通，包括发送服务通知、营销信息、调查问卷等</li>
              <li>确保我们服务的安全性，包括预防欺诈、保护用户账户安全等</li>
              <li>遵守适用的法律法规和法律程序</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="section-title">四、用户权利</h2>
            <p className="section-content">
              您有权查询、更正、删除自己的个人信息，具体操作可通过平台账户设置完成。
              根据适用的数据保护法律法规，您可能享有以下权利：
            </p>
            
            <ul className="policy-list">
              <li>访问您的个人信息</li>
              <li>更正或更新您的个人信息</li>
              <li>删除您的个人信息</li>
              <li>限制或反对我们对您个人信息的处理</li>
              <li>数据可携带权，即获取您提供给我们的个人信息并将其传输给其他方</li>
              <li>撤回您之前给予的同意</li>
              <li>向数据保护监管机构投诉</li>
            </ul>
            
            <p className="section-content">
              如您需要行使上述权利，请通过平台内的反馈渠道或联系我们的客服团队。
              我们将在合理的时间内响应您的请求。
            </p>
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="policy-footer">
        <div className="footer-container">
          <div className="footer-links">
            <Link to="/policy/privacy" className="footer-link">隐私条款</Link>
            <Link to="/policy/terms" className="footer-link">服务条款</Link>
            <Link to="/about" className="footer-link">关于我们</Link>
            <Link to="/contact" className="footer-link">联系我们</Link>
          </div>
          <div className="footer-copyright">
            &copy; 2023 MUNDO 平台. 保留所有权利.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;