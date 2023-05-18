import React from 'react';
import classNames from 'classnames';

import { fuzzyCaseInsensitive } from '@topology-utils';
import useDocumentListener from '@topology-utils/hooks/useDocumentListener/useDocumentListener';

import SuggestionLine from './components/SuggestionLine';
import { TextFilter } from './components/TextFilter';
import { MAX_SUGGESTIONS } from './utils/const';
import { labelParser, suggestionBoxKeyHandler } from './utils/utils';

type AutocompleteInputProps = {
  onSuggestionSelect: (selected: string) => void;
  placeholder?: string;
  suggestionCount?: number;
  showSuggestions?: boolean;
  textValue: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  data?: any;
  labelPath?: string;
};

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
  const [suggestions, setSuggestions] = React.useState<string[]>();
  const { visible, setVisible, ref } = useDocumentListener<HTMLDivElement>(suggestionBoxKeyHandler);
  const {
    textValue,
    setTextValue,
    onSuggestionSelect,
    placeholder,
    showSuggestions,
    data,
    className,
    labelPath,
  } = props;

  const onSelect = (value: string) => {
    onSuggestionSelect(value);
    if (visible) {
      setVisible(false);
    }
  };

  const activate = () => {
    if (textValue.trim()) {
      setVisible(true);
    }
  };

  const handleInput = (input: string) => {
    if (input) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    setTextValue(input);
  };

  React.useEffect(() => {
    if (textValue && visible && showSuggestions) {
      const processed = labelParser(data, labelPath);
      // User input without whitespace
      const processedText = textValue.trim().replace(/\s*=\s*/, '=');
      const filtered = [...processed]
        .filter((item) => fuzzyCaseInsensitive(processedText, item))
        .slice(0, MAX_SUGGESTIONS);
      setSuggestions(filtered);
    }
  }, [visible, textValue, showSuggestions, data, labelPath]);

  return (
    <div className="co-suggestion-box" ref={ref}>
      <TextFilter
        value={textValue}
        onChange={handleInput}
        placeholder={placeholder}
        onFocus={activate}
      />
      {showSuggestions && (
        <div
          className={classNames('co-suggestion-box__suggestions', {
            'co-suggestion-box__suggestions--shadowed': visible && suggestions?.length > 0,
          })}
        >
          {visible &&
            suggestions?.map((elem) => (
              <SuggestionLine
                suggestion={elem}
                key={elem}
                onClick={onSelect}
                className={className}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
