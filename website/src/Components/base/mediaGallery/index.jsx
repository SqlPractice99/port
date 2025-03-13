import React,  {useEffect} from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Image from "../image";
import Video from "../video";

const MediaGallery = ({ mediaArray, setMediaArray }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside, do nothing
  
    const updatedArray = Array.from(mediaArray); // Create a new array
    const [reorderedItem] = updatedArray.splice(result.source.index, 1);
    updatedArray.splice(result.destination.index, 0, reorderedItem);
  
    setMediaArray([...updatedArray]); // Ensure a new array reference
  };
  

  useEffect(() => {
    console.log("Updated mediaArray:", mediaArray);
  }, [mediaArray]); // Depend on mediaArray to track updates
  

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="media-list"
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="media-list border"
          >
            {mediaArray.map((item, index) => (
              <Draggable key={item} draggableId={item} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="media-item border"
                  >
                    {item.endsWith(".mp4") ? (
                      <Video video={item} />
                    ) : (
                      <Image src={`http://localhost:8000/${item}`} />
                    )}
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
