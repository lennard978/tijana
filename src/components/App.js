import { useEffect, useState } from "react";
import "../components/App.css";
import styled from "styled-components";
import { useSpeechSynthesis } from "react-speech-kit";
import { v4 as uuidv4 } from "uuid";
import { IoClose } from "react-icons/io5";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

function App() {
  useSpeechSynthesis();
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices.find(({ lang }) => lang.startsWith("en"));

  const [serbianWord, setSerbianWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");

  const [list, setList] = useState(getLocalStorage());

  const collectSerbianWord = (e) => {
    e.preventDefault();
    setSerbianWord(e.target.value);
  };

  const collectEnglishWord = (e) => {
    e.preventDefault();
    setEnglishWord(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const newItems = {
      id: uuidv4(),
      serbianWord: serbianWord,
      englishWord: englishWord,
    };
    setList([newItems, ...list]);
    setEnglishWord("");
    setSerbianWord("");
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  const deleteItem = (id) => {
    setList(list.filter((item) => item.id !== id));
  };

  return (
    <Container>
      <InputBox>
        <Input
          type="text"
          name="serbian"
          id="serbian"
          placeholder="Srpska rec ..."
          value={serbianWord}
          onChange={(e) => collectSerbianWord(e)}
        />
        <Input
          type="text"
          name="english"
          id="english"
          placeholder="Engleska rec ..."
          value={englishWord}
          onChange={(e) => collectEnglishWord(e)}
        />
        <Button type="submit" onClick={(e) => submitHandler(e)}>
          Sacuvaj
        </Button>
      </InputBox>

      {list.map((item) => {
        return (
          <Wrapper key={item.id}>
            <Row
              onClick={() =>
                speak({ rate: 1, pitch: 1, voice, text: item.englishWord })
              }
            >
              <SerbianParagraph>{item.serbianWord}</SerbianParagraph>
              <EnglishParagraph>{item.englishWord}</EnglishParagraph>
            </Row>
            <CloseBtn onClick={() => deleteItem(item.id)}>
              <IoClose color="white" />
            </CloseBtn>
          </Wrapper>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom, #243b50, #141e30);
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(to left, #243b50, #141e30);
  padding: 0.5rem;
  margin: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input.attrs({ type: "text" })`
  background: linear-gradient(to right, #243b50, #141e30);
  color: white;
  cursor: pointer;
  margin-bottom: 0;
  text-transform: uppercase;
  border-radius: 5px;
  margin: 0.2rem;
  height: 30px;
  border-color: transparent;
  box-shadow: 0px;
  outline: none;
  transition: 0.15s;
  text-align: center;
`;

const Button = styled.button`
  display: flex;
  align-self: center;
  inline-size: 30%;
  justify-content: center;
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  padding-block: 0.5rem;
  padding-inline: 2rem;
  margin: 0.5rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  cursor: pointer;
  &:active {
    border: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  inline-size: 100vw;
  background-image: linear-gradient(to bottom, #243b50, #141e30);
  margin: 0.4rem;
  padding: 1rem;
  border-radius: 0.2rem;
  cursor: pointer;
`;

const SerbianParagraph = styled.p`
  color: rgba(57, 255, 20, 1);
  font-size: 1.1rem;
`;

const EnglishParagraph = styled.p`
  color: white;
  font-style: italic;
  font-size: 1.1rem;
`;

const CloseBtn = styled.button`
  background: rgba(200, 0, 0, 0.8);
  border: none;
  display: flex;
  padding: 0.6rem;
  margin-right: 0.2rem;
`;

export default App;
