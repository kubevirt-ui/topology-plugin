import React, { FC } from 'react';

type LogSnippetProps = {
  logSnippet?: string;
  message: string;
};

const LogSnippet: FC<LogSnippetProps> = ({ logSnippet, message }) => {
  return (
    <div className="ocs-log-snippet">
      <p className="ocs-log-snippet__status-message">{message}</p>
      {logSnippet && <pre className="co-pre ocs-log-snippet__log-snippet">{logSnippet}</pre>}
    </div>
  );
};

export default LogSnippet;
