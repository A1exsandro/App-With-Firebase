import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assests/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database, ref, push } from '../services/firebase';


import '../styles/room.scss';


export function Room() {
    const { user } = useAuth();
    const { id } = useParams();
    const [newQuestion, setNewQuestion] = useState ('');

    const roomId = id;

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
                <RoomCode code={`${roomId}`}/>
                </div>
            </header>
            
            <main>
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span id="quest">4 perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça o seu login</button>.</span>
                        ) }
                        
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}