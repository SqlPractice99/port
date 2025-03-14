import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Image from "../image";
import Video from "../video";

const MediaGallery = ({ mediaArray, setMediaArray, renderItem }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedArray = [...mediaArray];
    const [movedItem] = updatedArray.splice(result.source.index, 1);
    updatedArray.splice(result.destination.index, 0, movedItem);

    setMediaArray([...updatedArray]); // Update parent state
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="media-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="med-list flex column center border">
            {mediaArray.map((item, index) => (
              <Draggable key={index} draggableId={String(index)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="media-item flex center border"
                    style={{
                      ...provided.draggableProps.style,
                      background: snapshot.isDragging ? "#f0f0f0" : "white",
                    }}
                  >
                    {renderItem(item, index)} {/* 👈 Custom Render Function */}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default MediaGallery;