import "../styles/header.scss"

const Header:React.FC = () => {
  return (
    <>
     <div className='header-box'>
      <div>
         <h3 className='title-header'>TaskMaster</h3>
      </div>
      
      <div>
        <p>New Todo</p>
        <p>all Todos</p>
        <p>finished Works</p>
        <p className='profile-photo-header'>a</p>
      </div>
     </div>
    </>
  )
}

export default Header