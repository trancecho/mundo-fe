import React from "react";
import style from "@/pages/Login/Auth.module.css";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onClose }) => {
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
        WebkitOverflowScrolling: 'touch' // 优化移动端滚动体验
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
          animation: 'fadeIn 0.3s ease-out' // 添加淡入动画
        }}
        onClick={(e) => e.stopPropagation()} // 阻止点击内容时关闭
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
                      marginLeft: 'auto',
                      display: 'block' // 块级元素便于布局
                    }}
                    onClick={onClose}
                  >
                    关闭
                  </button>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'black' }}>隐私政策</h2>
        <div style={{ lineHeight: '1.8', marginBottom: '1.5rem', color: 'black' }}>
          <div style={{ fontWeight: "bold", marginBottom: "1rem", color: 'black' }}>一、总则</div>
          <p style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem" , color: 'black'}}>
            欢迎您使用 MUNDO（以下简称 “本论坛”）！本论坛高度重视用户个人信息的保护...
          </p>
          
<p 
          className={style.authSubtitle} 
          style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
        >
          本隐私条款将帮助您了解以下内容：
        </p>

        <ul 
          className={style.authSubtitle} 
          style={{ 
            textAlign: "left", 
            textIndent: "2em", 
            marginBottom: "1.5rem", 
            lineHeight: "1.8", 
            listStyle: "decimal inside" 
            , color: 'black'
          }}
        >
          <li>我们收集哪些个人信息以及如何收集；</li>
          <li>我们如何使用这些个人信息；</li>
          <li>我们如何保护您的个人信息；</li>
          <li>您对个人信息享有的权利；</li>
          <li>我们如何共享、转让、公开披露您的个人信息；</li>
          <li>本隐私条款的更新与通知；</li>
          <li>如何联系我们。</li>
        </ul>

        <p 
          className={style.authSubtitle} 
          style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
        >
          本隐私条款适用于您通过任何方式访问和使用本论坛的服务，包括但不限于本论坛的网页端、移动端应用程序等。
        </p>

        {/* 收集的个人信息部分 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" , color: 'black'}}>
              二、我们收集的个人信息
            </div>
            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （一）注册与登录信息
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              当您注册本论坛账号或登录本论坛时，我们需要收集您主动提供的信息，包括但不限于：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>
                账号信息：如用户名、密码、手机号码、电子邮箱地址。其中，手机号码和电子邮箱地址将作为您账号找回、安全验证的重要依据，也是我们向您发送重要通知的渠道。
              </li>
              <li>
                个人资料：您可以选择填写头像、昵称、性别、出生日期、个人简介等信息，这些信息将用于展示您的个人形象，增强您在论坛内与其他用户的互动体验。
              </li>
            </ul>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （二）使用论坛服务过程中收集的信息
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ color: 'black',textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" }}
            >
              在您使用本论坛服务的过程中，我们会自动收集以下与您使用服务相关的信息：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>
                日志信息：我们的服务器会自动记录您的使用情况，包括但不限于您访问本论坛的日期和时间、使用的浏览器类型、操作系统、IP 地址、页面浏览记录、搜索记录、点击操作记录、停留时长。这些信息有助于我们分析服务使用情况，优化服务体验，保障服务安全。
              </li>
              <li>
                设备信息：我们会收集您使用的设备信息，如设备型号、设备标识符（IMEI、Android ID、IDFA、OAID 及其他设备标识符）、设备 MAC 地址、软件列表、设备所在位置相关信息（包括 IP 地址、GPS 位置以及能够提供相关信息的 WLAN 接入点、蓝牙和基站传感器信息）。这些信息用于为您提供更契合您需求的服务，保障服务的稳定性和安全性。
              </li>
            </ul>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （三）通过第三方获取的信息
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              如果您选择通过第三方账号（如微信、QQ、微博等）登录本论坛，我们会在获得您授权后，从第三方平台获取您授权提供的账号信息（如头像、昵称、第三方账号 ID），并将第三方账号与您的本论坛账号进行绑定，以便您使用第三方账号直接登录并使用本论坛服务。同时，我们会根据第三方平台提供的信息同步更新您在本论坛的相关资料，以丰富您的个人信息展示。
            </p>

            {/* 三、我们如何使用个人信息 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" , color: 'black'}}>
              三、我们如何使用个人信息
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              我们严格遵守法律法规的规定以及与用户的约定，按照本隐私条款所述使用收集的个人信息，目的在于向您提供更好的服务和体验，具体用途包括：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>为您提供注册、登录服务，保障您的账号安全，进行身份验证和账号管理。</li>
              <li>向您展示个性化的内容，推荐您可能感兴趣的帖子、话题、活动，提升您在本论坛的使用体验。</li>
              <li>分析您的使用习惯和行为数据，优化本论坛的功能和服务，改进产品性能，提高服务质量。</li>
              <li>向您发送与本论坛服务相关的通知，如系统公告、活动通知、消息提醒等。您可以在本论坛的设置中管理消息通知权限，自主选择接收或关闭部分类型的通知。</li>
              <li>处理您的用户反馈、投诉和建议，及时解决您在使用过程中遇到的问题，与您进行必要的沟通和联系。</li>
              <li>为预防、发现、调查欺诈、侵权、危害网络安全、非法或违反我们规则或政策的行为，保障本论坛及其他用户的合法权益，我们可能会使用您的个人信息进行安全监测和风险防范。</li>
              <li>我们可能会将收集到的个人信息进行匿名化、去标识化处理，用于统计分析、研究和开发新的产品或服务，以改善我们的整体服务水平，但这些信息不会识别到具体的个人。</li>
            </ul>

            {/* 四、我们如何保护您的个人信息 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" , color: 'black'}}>
              四、我们如何保护您的个人信息
            </div>
            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （一）技术措施
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              我们采取了一系列技术安全措施来保护您的个人信息，防止其被泄露、毁损、篡改或丢失。例如，我们使用加密技术（如 SSL）对您的敏感信息（如密码）进行加密传输和存储；采用访问控制机制，限制只有授权人员才能访问您的个人信息；部署安全防护系统，防范网络攻击和恶意行为。
            </p>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （二）管理措施
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              我们建立了严格的内部管理制度和操作规程，对接触、使用您个人信息的人员进行严格的权限控制，并定期对相关人员进行数据安全培训，提高其安全意识和保密意识。同时，我们会定期对个人信息处理活动进行安全审计，确保符合法律法规和本隐私条款的要求。
            </p>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （三）安全事件处理
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              如不幸发生个人信息安全事件，我们将立即启动应急预案，采取必要的补救措施，防止损害扩大，并在 72 小时内以邮件、信函、电话、推送通知等方式向您告知安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。如果因特殊情况无法在 72 小时内完成告知，我们将在最晚不超过事件发生后的 10 个工作日内告知您。如果安全事件涉及未成年人的个人信息，我们将在确认事件发生后的 72 小时内告知其监护人。
            </p>

            {/* 五、您对个人信息享有的权利 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" , color: 'black'}}>
              五、您对个人信息享有的权利
            </div>
            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （一）查询、更正与补充
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              您有权查询、更正或补充您在本论坛的个人信息。您可以通过登录本论坛账号，进入个人资料设置页面进行相关操作。如果您无法通过上述方式自行完成查询、更正或补充，您可以通过本隐私条款末尾提供的联系方式联系我们，我们将在 15 个工作日内协助您处理。
            </p>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （二）删除
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              在以下情形下，您有权要求我们删除您的个人信息：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>我们处理个人信息的行为违反法律法规；</li>
              <li>我们收集、使用您的个人信息，却未征得您的同意；</li>
              <li>我们处理个人信息的行为违反了与您的约定；</li>
              <li>您不再使用我们的服务，或您的账号已注销；</li>
              <li>我们不再为您提供服务。</li>
            </ul>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              当您向我们提出删除请求时，我们将在核实您的身份后，在符合相关法律法规要求的前提下，尽快删除您的个人信息。但根据法律法规的规定，某些信息在特定情况下可能无法立即删除，如出于审计、法律合规等目的需要保留一定期限的日志信息。
            </p>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （三）撤回同意
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              您可以通过本论坛的设置功能或联系我们，撤回您对收集、使用您个人信息的同意授权。但撤回同意可能会影响您继续使用本论坛的部分或全部服务。
            </p>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （四）注销账号
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              您可以通过本论坛提供的注销功能申请注销您的账号。在注销账号后，我们将停止收集、使用和处理您的个人信息，并删除或匿名化处理您的个人信息，但法律法规另有规定或监管部门另有要求的除外。
            </p>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （五）获取个人信息副本
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              在符合相关法律法规规定的前提下，您有权要求我们向您提供您的个人信息副本。您可以通过本隐私条款末尾提供的联系方式联系我们，并说明具体需求，我们将在 15 个工作日内予以响应并提供相关信息。
            </p>

            {/* 六、我们如何共享、转让、公开披露您的个人信息 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" , color: 'black'}}>
              六、我们如何共享、转让、公开披露您的个人信息
            </div>
            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （一）共享
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              我们不会向其他任何公司、组织和个人共享您的个人信息，但以下情况除外：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>事先获得您的明确同意；</li>
              <li>根据法律法规的规定或行政、司法机关的要求，我们可能需要向相关部门提供您的个人信息；</li>
              <li>为了向您提供本论坛服务，我们可能会将您的个人信息共享给我们的关联公司、合作伙伴（如技术服务提供商、服务器托管商、数据分析机构），但我们会与这些第三方签订严格的保密协议，要求他们按照我们的要求、本隐私条款以及其他任何相关的保密和安全措施来处理您的个人信息，并对其处理个人信息的行为进行监督，保障您的个人信息安全。</li>
            </ul>

            <div style={{ marginLeft: "2em" , color: 'black'}}>
              （二）转让
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" , color: 'black'}}
            >
              我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>事先获得您的明确同意；</li>
              <li>根据法律法规的规定或行政、司法机关的要求；</li>
              <li>涉及合并、收购、资产转让或类似交易时，我们会告知您相关情形，并要求新的持有您个人信息的公司、组织继续受本隐私条款的约束，否则我们将要求该公司、组织重新向您征求授权同意。</li>
            </ul>

            <div style={{ marginLeft: "2em", color: 'black' }}>
              （三）公开披露
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8", color: 'black' }}
            >
              我们仅会在以下情况下公开披露您的个人信息：
            </p>
            <ul 
              className={style.authSubtitle} 
              style={{ 
                textAlign: "left", 
                textIndent: "2em", 
                marginBottom: "1.5rem", 
                lineHeight: "1.8", 
                listStyle: "disc inside" ,
                color: 'black'
              }}
            >
              <li>获得您明确同意或基于您的主动选择；</li>
              <li>根据法律法规的规定、诉讼、争议解决需要，或行政、司法机关依法提出要求；</li>
              <li>为维护社会公共利益，保护本论坛、本论坛用户或其他主体的合法权益，在合理范围内披露您的个人信息。在公开披露您的个人信息前，我们会评估该公开披露行为的必要性，并采取必要的技术和管理措施，保障您的个人信息安全。</li>
            </ul>

            {/* 七、第三方服务 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" ,color: 'black'}}>
              七、第三方服务
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" ,color: 'black'}}
            >
              本论坛可能包含指向其他网站或服务的链接，这些第三方网站或服务有其独立的隐私政策和用户协议，我们无法控制它们对您个人信息的收集、使用和处理行为。请您在访问这些第三方网站或服务时，仔细阅读其隐私政策和用户协议，谨慎提供个人信息。如果您通过本论坛使用第三方服务，在您授权同意的情况下，第三方可能会收集您的个人信息，具体收集情况请以第三方的说明为准。我们不对第三方的行为负责，也不承担任何法律责任。
            </p>

            {/* 八、未成年人个人信息保护 */}
            <div style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              八、未成年人个人信息保护
            </div>
            <p 
              className={style.authSubtitle} 
              style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8" ,color: 'black'}}
            >
              我们非常重视对未成年人个人信息的保护。本论坛的服务主要面向成年人。如果您是 14 周岁以下的未成年人，在使用本论坛服务前，应事先取得您的家长或法定监护人的书面同意。我们仅在法律法规允许、家长或法定监护人明确同意或者保护未成年人所必要的情况下收集、使用、共享、转让或公开披露未成年人的个人信息。如果我们发现自己在未事先获得可证实的家长或法定监护人同意的情况下收集了未成年人的个人信息，我们会尽快删除相关信息。如果您认为我们收集了您监护的未成年人的个人信息，请通过本隐私条款末尾提供的联系方式联系我们，我们将尽快进行处理。
            </p>

        <div style={{ fontWeight: "bold", marginBottom: "1rem" ,color: 'black'}}>九、本隐私条款的更新与通知</div>
        <p 
          className={style.authSubtitle} 
          style={{ textAlign: "left", textIndent: "2em", marginBottom: "1.5rem", lineHeight: "1.8",color: 'black' }}
        >
          我们可能会根据法律法规的变化、业务发展或其他原因对本隐私条款进行更新。更新后的隐私条款将在本论坛显著位置公布，并以弹窗、推送通知等方式提示您。若您在本隐私条款更新后继续使用本论坛服务，即表示您已充分阅读、理解并接受更新后的隐私条款。如果您不同意更新后的隐私条款，您应停止使用本论坛服务。
        </p>
          
        </div>
        <button 
          style={{
            color: 'rgba(22, 119, 255, 0.66)',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            float: 'right',
            transition: 'background-color 0.2s',
          }}
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;