import React from 'react';
import MarkupFormatter from './markup';

function MsgBox({ role, content }) {
    const codeline = content.split('```');
    const copyToClipboard = (text) => () => {
        navigator.clipboard.writeText(text);
    };
    return (
        <div>
            {role === 'user' ? <p style={{ color: '#4444ff', display: 'inline-block' }}>You: </p> : <p style={{ color: '#ff4444', display: 'inline-block' }}>Gemini: </p>}
            <div style={{ paddingLeft: '10px' }}>
                {
                    codeline.map((line, index1) => {
                        let style1 = (index1 % 2 === 0) ? {} : { backgroundColor: 'black', borderRadius: 5, paddingLeft: 20 , paddingTop:10, paddingBottom:10};
                        const parts = line.split('\n')
                        return (
                            <>
                                {
                                    // Code block header
                                    index1 % 2 === 1 ?
                                        <div style={snippetHeader}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                                <div>
                                                    {parts[0]}
                                                </div>
                                                <div style={{ fontSize: 12 }} onClick={copyToClipboard(line)}>
                                                    copy
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }

                                <div key={index1} style={style1}>
                                    {
                                        // Code block content / text
                                        index1 % 2 === 0 ?
                                            parts.map((part, index) => {
                                                return <MarkupFormatter key={index} text = {part} />
                                            }) :
                                            parts.slice(1).map((part, index) => {
                                                return <p key={index}>{part}</p>
                                            })
                                    }
                                </div>
                                <br key={index1 + 1} />
                            </>
                        );
                    })
                }
            </div>
        </div>
    );
}



const snippetHeader = {
    backgroundColor: '#444',
    color: 'white',
    padding: '10px',
    borderRadius: '5px 5px 0px 0px'
};

export default MsgBox;