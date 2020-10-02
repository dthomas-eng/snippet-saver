import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ListContext from "../../context/list/listContext";
import PropTypes from "prop-types";

const List = ({ snippet }) => {
  const listContext = useContext(ListContext);
  const { setCurrent } = listContext;

  const viewClicked = () => {
    setCurrent(snippet);
  };

  let previewNotes = "";
  snippet.notes.length > 200
    ? (previewNotes = snippet.notes.substring(0, 200) + "...")
    : (previewNotes = snippet.notes);

  return (
    <span onClick={viewClicked}>
      <Link to='/view'>
        <div
          className='card mb-1 square-border bg-white mb-3 flipped'
          style={{ maxWidth: "45rem" }}
        >
          <div className='card-body py-1 px-2 hover-accent border-left-3'>
            <span className='card-title text-dark body-text-14'>
              {snippet.title}
            </span>
            <hr></hr>
            <span className='card-text text-dark body-text-12'>
              {previewNotes}
            </span>
          </div>
        </div>
      </Link>
    </span>
  );
};

List.propTypes = {
  snippet: PropTypes.object.isRequired,
};

export default List;
