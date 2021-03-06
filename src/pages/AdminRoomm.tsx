import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assests/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database, ref, push, onValue } from '../services/firebase';


import '../styles/room.scss';

type FirebaseQuestions = Record<string, {
    author: {
        name:string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name:string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}


export function AdminRoom() {
    const { user } = useAuth();
    const { id } = useParams();
    const [newQuestion, setNewQuestion] = useState ('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');

    const roomId = id;

    useEffect(() => {
        const roomRef = ref(database,`rooms/${roomId}`);
    
        onValue(roomRef, room => {
            const databaseRoom = room.val();
            const FirebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
           const parsedQuestion = Object.entries(FirebaseQuestions).map(([key, value]) => {
               return {
                   id: key,
                   content: value.content,
                   author: value.author,
                   isHighlighted: value.isHighlighted,
                   isAnswered: value.isAnswered,
               }
           });
           setTitle(databaseRoom.title);
           setQuestions(parsedQuestion);  
        });

    }, [roomId]);


    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();

        if (newQuestion.trim() === ''){
            return;
        }

        if (!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        };
        
        await push(ref(database,`rooms/${roomId}/questions`),question);

        setNewQuestion('');
         
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                <div>
                    <RoomCode code={`${roomId}`}/>
                    <Button isOutlined>Encerrar Sala</Button>
                </div>
                </div>
            </header>
            
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span id="quest">{questions.length} pergunta(s)</span>}
                </div>


                {questions.map(question => {
                    return (
                        <Question 
                            content={question.content}
                            author={question.author}
                        />
                    );
                })}
            </main>
        </div>
    );
}