import styled from 'styled-components';

const FooterDiv = styled.div({
  display: 'flex',
  position: 'relative',
  justifyContent: 'space-between',
  alignContent: 'center',
  height: '120px',
  padding: '20px 40px',
  backgroundColor: '#eeee',
  boxShadow: '0 -3px 10px -1px black',
  width: '1000px',
  fontWeight: 'bold',
});

export const Footer = () => {
  return (
    <FooterDiv>
      <div>
        <div>Блог веб-разработчика</div>
        <div>web@developer.ru</div>
      </div>
      <div>
        <div>{new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}</div>
        <div>Погодный виджет отключен</div>
      </div>
    </FooterDiv>
  );
};
