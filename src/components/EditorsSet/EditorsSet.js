import React, { useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '../Editor/Editor';
import { Separator } from '../Separator/Separator';
import { setPropertyValue } from '../../utils';
import './EditorsSet.css';

const EditorsSet = ({
    className,
    handleChange,
    requestValue,
    responseValue,
    isRequestValid,
    isResponseValid
  }) => {

  const dispatch = useDispatch();
  const editorsResizeDelta = useSelector(state => state.editorsResizeDelta);
  const editorSetRef = useRef();

  const handleDrag = (event) => {
    /* TODO:
    - добавить ограничение про минимальную ширину
    */
    dispatch({
      type: 'setEditorsResizeDelta',
      delta: event.movementX
    });
  }

  useLayoutEffect(() => {
    setPropertyValue(
      editorSetRef.current,
      '--resize-delta',
      editorsResizeDelta + 'px'
    );
  }, [editorsResizeDelta])

  return (
    <div className={`${className} editors-set`} ref={editorSetRef}>
      <Editor
        className={`
          editors-set__item
          editors-set__item--request
          ${!isRequestValid ? 'editor--warn' : ''}
        `}
        title="Запрос"
        onChange={handleChange}
        value={requestValue}
        resizeDelta={editorsResizeDelta}
      />
      <Separator className="editors-set__separator" handleDrag={handleDrag} resizeDelta={editorsResizeDelta} />
      <Editor
        className={`
        editors-set__item
        editors-set__item--response
        ${!isResponseValid ? 'editor--warn' : ''}
      `}
        title="Ответ"
        readOnly={true}
        value={responseValue}
        resizeDelta={-editorsResizeDelta}
      />
    </div>
  );
}

export { EditorsSet };
