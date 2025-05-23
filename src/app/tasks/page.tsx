// src/app/tasks/page.tsx
 'use client';
 import { useEffect, useState } from 'react';
 import Image from 'next/image';
 import Link from 'next/link';
 
 interface Task {
   userId: string;
   taskId: string;
   createdAt: string;
   status: string;
   title: string;
   updatedAt: string;
 }
 
 export default function TasksPage() {
   const [tasks, setTasks] = useState<Task[]>([]);
   const [newTitle, setNewTitle] = useState('');
   const [newStatus, setNewStatus] = useState('to do');

   const statusClasses: Record<string, string> = {
     'done': 'bg-green-100 text-green-800',
     'to do': 'bg-blue-100 text-blue-800',
     'code review': 'bg-indigo-100 text-indigo-800',
     'testing': 'bg-yellow-100 text-yellow-800',
     'ready to be merged': 'bg-purple-100 text-purple-800',
   };
   
   useEffect(() => {
     fetch('/api/tasks')
       .then(res => res.json())
       .then((data: Task[]) => setTasks(data));
   }, []);
 
   async function handleAddTask(e: React.FormEvent) {
     e.preventDefault();
     const title = newTitle.trim();
     if (!title) return;
     const newTask: Task = {
       userId: 'test-user-1',
       taskId: crypto.randomUUID(),
       title,
       status: newStatus,
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
     };
     const res = await fetch('/api/tasks', {
       method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(newTask),
     });
     if (res.ok) {
       setTasks(prev => [...prev, newTask]);
       setNewTitle('');
       setNewStatus('to do');
     } else {
       console.error('Failed to add task');
     }
   }
 
   async function handleDeleteTask(taskId: string) {
     const res = await fetch('/api/tasks', {
       method: 'DELETE',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({ userId: 'test-user-1', taskId }),
     });
     if (res.ok) {
       setTasks(prev => prev.filter(task => task.taskId !== taskId));
     } else {
       console.error('Failed to delete task');
     }
   }

   // New handler to update task status
   async function handleStatusChange(taskId: string, status: string) {
     const res = await fetch('/api/tasks', {
       method: 'PUT',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify({ userId: 'test-user-1', taskId, status }),
     });
     if (res.ok) {
       const updated = await res.json();
       setTasks(prev => prev.map(t => t.taskId === taskId ? {...t, status: updated.status, updatedAt: updated.updatedAt} : t));
     } else {
       console.error('Failed to update status');
     }
   }

   return (
     <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#232F3E] to-[#121417]">
       <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 border-2 border-[#FF9900]">
         <Image src="/AWS_LOGO.png" alt="AWS Logo" width={48} height={48} className="mx-auto mb-6" />
         <h1 className="text-3xl font-bold text-center text-[#232F3E] mb-6">Your Tasks</h1>
         <form onSubmit={handleAddTask} className="mb-6 flex space-x-2">
           <input
             type="text"
             value={newTitle}
             onChange={e => setNewTitle(e.target.value)}
             placeholder="New task title"
             className="flex-1 p-2 border border-gray-300 rounded placeholder-gray-500 text-gray-800"
             required
           />
           <select
             value={newStatus}
             onChange={e => setNewStatus(e.target.value)}
             className={`p-2 border border-gray-300 rounded ${statusClasses[newStatus] || 'bg-white text-gray-800'}`}
           >
             <option value="to do">To Do</option>
             <option value="code review">Code Review</option>
             <option value="testing">Testing</option>
             <option value="ready to be merged">Ready to Be Merged</option>
             <option value="done">Done</option>
           </select>
           <button
             type="submit"
             className="bg-[#FF9900] text-white px-4 py-2 rounded hover:bg-[#e68a00]"
           >
             Add Task
           </button>
         </form>
         {tasks.length > 0 ? (
           <div className="space-y-4">
             {tasks.map(task => (
               <div key={task.taskId} className="bg-gray-100 rounded-md p-4 flex items-center justify-between">
                 <div>
                   <h3 className="text-lg font-medium text-gray-800">{task.title}</h3>
                   <p className="text-sm text-gray-500">Created: {new Date(task.createdAt).toLocaleString()}</p>
                 </div>
                 <div className="flex items-center space-x-2">
                   <select
                     value={task.status}
                     onChange={e => handleStatusChange(task.taskId, e.target.value)}
                     className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusClasses[task.status] || 'bg-gray-100 text-gray-800'}`}
                   >
                     <option value="to do">To Do</option>
                     <option value="code review">Code Review</option>
                     <option value="testing">Testing</option>
                     <option value="ready to be merged">Ready to Be Merged</option>
                     <option value="done">Done</option>
                   </select>
                   <button onClick={() => handleDeleteTask(task.taskId)} className="text-red-500 hover:text-red-700">&times;</button>
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-center text-gray-300">No tasks available</p>
         )}
         <p className="mt-6 text-center">
           <Link href="/" className="text-[#FF9900] hover:underline">
             Back to Dashboard
           </Link>
         </p>
       </div>
     </main>
   );
 }
