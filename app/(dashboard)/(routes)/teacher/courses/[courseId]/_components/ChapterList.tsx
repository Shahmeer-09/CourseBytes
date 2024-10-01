"use client"

import { Chapters } from "@prisma/client";
import { use, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grid, Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/dist/server/api-utils";
interface chaptliprops {
  items: Chapters[];
  onEdit: (id: string) => void;
  onReorder: (updatedData: { id: string; position: number }[]) => void;
}
const ChapterList = ({ items, onEdit, onReorder }: chaptliprops) => {
  const [mounted, setismounted] = useState(false);
  const [chapters, setchapters] = useState<Chapters[]>(items || []);

  useEffect(() => {
    setchapters(items);
  }, [items]);
  useEffect(() => {
    setismounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startindex = Math.min(result.source.index, result.destination.index);
    const endindex = Math.max(result.source.index, result.destination.index);
    const updatedData = items.slice(startindex, endindex + 1);
    setchapters(items);
    const bulkupdate = updatedData.map((item, index) => ({
      id: item.id,
      position: items.findIndex((it) => it.id === item.id),
    }));
    onReorder(bulkupdate);
  };



  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapter-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chap, index) => (
              <Draggable key={chap.id} draggableId={chap.id} index={index}>
                {(provided) => (
                  <div
                    className={`border flex mt-4 items-center gap-x-2 rounded-md  ${
                      chap.isPublished
                        ? "bg-sky-200 border-sky-200 text-sky-800"
                        : " border-slate-200  bg-slate-200 text-zinc-700 "
                    } `}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={`px-2 py-3 border-r rounded-l-md transition ${
                        chap.isPublished
                          ? " border-r-sky-200 hover:bg-sky-300"
                          : "hover:bg-slate-300 border-r-slate-200 "
                      }  `}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-4 w-4" />
                    </div>
                    <div className="flex justify-between w-full">
                      {chap.title}
                      <div className=" ml-auto flex items-center pr-2 gap-x-2  ">
                        {chap.isFree && <Badge> free </Badge>}
                        <Badge
                          className={` ${
                            chap.isPublished ? "bg-sky-400 hover:bg-sky-400 " : " hover:bg-slate-400 bg-slate-400"
                          }`}
                        >
                          {chap.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          className=" h-4 w-4 transition hover:opacity-75 cursor-pointer  "
                          onClick={onEdit.bind(null, chap.id)}
                        />
                      </div>
                    </div>
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

export default ChapterList;
