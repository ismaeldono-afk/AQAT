import React from 'react';

export default function App() {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-5">
        <div className="flex gap-3 items-center">
          <img className="h-[72px]" src="/unitech-logo.png" alt="PNG UniTech logo" />
          <div>
            <div className="font-bold">The Papua New Guinea</div>
            <div className="text-lg font-bold">UNIVERSITY OF TECHNOLOGY</div>
            <div className="text-xs text-gray-800">AQAT — Academic Quality Assurance &amp; Transformation</div>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-lg m-0 mb-1">AQAT Verification of Subject Files</h1>
          <div className="text-[13px] text-gray-800">Online &amp; Offline Subject Verification Observation Assessment Sheet</div>
        </div>
      </header>

      <section className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
        <div className="min-w-[220px]"><strong>Staff Name/s:</strong> Ms. Miriam Masibameng</div>
        <div className="min-w-[220px]"><strong>School:</strong> SCHOOL OF SURVEYING</div>
        <div className="min-w-[220px]"><strong>Subject:</strong> PSO213 &nbsp;&nbsp;<strong>Subject Code:</strong> ______</div>
        <div className="min-w-[220px]">
          <strong>Semester:</strong>
          <span className="ml-2 inline-flex items-center gap-1" title="Semester 1 checked">
            <span className="inline-block w-3.5 h-3.5 border border-gray-800 text-center text-[10px] leading-3">✔</span> 1
          </span>
          <span className="ml-2 inline-flex items-center gap-1" title="Semester 2 unchecked">
            <span className="inline-block w-3.5 h-3.5 border border-gray-800 text-center text-[10px] leading-3">&nbsp;</span> 2
          </span>
        </div>
        <div className="min-w-[220px]"><strong>Year:</strong> 2025</div>
        <div className="min-w-[220px]">
          <strong>Submitted:</strong>
          <span className="ml-2 inline-flex items-center gap-1"><span className="inline-block w-3.5 h-3.5 border border-gray-800 text-center text-[10px] leading-3">✔</span> Yes</span>
          <span className="ml-2 inline-flex items-center gap-1"><span className="inline-block w-3.5 h-3.5 border border-gray-800 text-center text-[10px] leading-3">&nbsp;</span> No</span>
        </div>
        <div className="min-w-[220px]">
          <strong>HoS signed/present in the subject file:</strong>
          <span className="ml-2 inline-flex items-center gap-1"><span className="inline-block w-3.5 h-3.5 border border-gray-800 text-center text-[10px] leading-3">✔</span> Yes</span>
          <span className="ml-2 inline-flex items-center gap-1"><span className="inline-block w-3.5 h-3.5 border border-gray-800 text-center text-[10px] leading-3">&nbsp;</span> No</span>
        </div>
      </section>

      <div className="text-[13px] mt-2 mb-2"><strong>Rating Legend:</strong> Complete = 2, Incomplete = 1, Nil = 0</div>

      <table className="w-full border-collapse mt-2 mb-4">
        <thead>
          <tr>
            <th className="w-[50px] border border-gray-400 p-2 text-left bg-gray-100 font-semibold">No.</th>
            <th className="border border-gray-400 p-2 text-left bg-gray-100 font-semibold">Details</th>
            <th className="w-[110px] border border-gray-400 p-2 text-center bg-gray-100 font-semibold">Complete (2)</th>
            <th className="w-[120px] border border-gray-400 p-2 text-center bg-gray-100 font-semibold">Incomplete (1)</th>
            <th className="w-[80px] border border-gray-400 p-2 text-center bg-gray-100 font-semibold">Nil (0)</th>
            <th className="w-[240px] border border-gray-400 p-2 text-left bg-gray-100 font-semibold">Comments / Action Required</th>
          </tr>
        </thead>
        <tbody>
          {[
            { no: '1', details: 'Lecture Plan', complete: false, comments: '' },
            { no: '2', details: 'Lecture Notes', complete: false, comments: '' },
            { no: '3', details: 'Tutorials (if compulsory only)', complete: false, comments: '' },
            { no: '4', details: 'Assignments with solutions and 3 marked copies', complete: false, comments: '' },
            { no: '5', details: 'Laboratory assignments with three marked copies', complete: false, comments: '' },
            { no: '6', details: 'Quizzes with solutions and 3 marked copies', complete: true, comments: 'Quizzes present and 3 marked copies attached' },
            { no: '7', details: 'Tests with solutions and 3 marked copies', complete: true, comments: 'Tests present and marked' },
            { no: '8', details: 'Field visit / Industrial training report', complete: false, comments: '' },
            { no: '9', details: 'Student Evaluation summary of Teachers', complete: false, comments: '' },
            { no: '10', details: 'Final Exam Question Paper and solutions', complete: false, comments: '' },
            { no: '11', details: 'Copy of final exam moderation sheet', complete: false, comments: '' },
            { no: '12', details: 'Copies of marked exam script', complete: false, comments: '' },
            { no: '13', details: 'Examiners’ report', complete: false, comments: '' },
            { no: '14', details: 'Annual Review of the subjects', complete: false, comments: '' },
            { no: 'A1', details: 'Continuous assessment with break-up', complete: false, comments: '' },
            { no: 'A2', details: 'Consolidation attendance with (%) @', complete: false, comments: '' },
            { no: 'A3', details: 'CA + final exam marks and Grade @', complete: false, comments: '' },
          ].map((row, idx) => (
            <tr key={idx}>
              <td className="border border-gray-400 p-2 text-center">{row.no}</td>
              <td className="border border-gray-400 p-2">{row.details}</td>
              <td className="border border-gray-400 p-2 text-center">{row.complete ? '✔' : '\u00A0'}</td>
              <td className="border border-gray-400 p-2 text-center">&nbsp;</td>
              <td className="border border-gray-400 p-2 text-center">&nbsp;</td>
              <td className="border border-gray-400 p-2 text-[13px]">{row.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-5 items-center">
        <div className="flex-1 max-w-[420px]">
          <div><strong>Subtotal (sum of ratings):</strong> ______ / 24</div>
          <div className="mt-2"><strong>Grand total:</strong> ______ / 24 &nbsp;&nbsp; <strong>Scaled ( /24 x 4 ) =</strong> ______ / 4</div>
        </div>
        <div className="flex-1">
          <div><strong>AQAT Chairperson’s Signature:</strong></div>
          <div className="mt-9 border-t border-gray-800 w-[300px] pt-2"></div>
        </div>
      </div>

      <div className="flex gap-10 mt-6">
        <div>
          <div className="border-t border-gray-800 w-[300px] pt-2 text-left"></div>
          <div className="text-[13px] text-gray-800">HoS / Coordinator signature &amp; Date</div>
        </div>
        <div>
          <div className="border-t border-gray-800 w-[300px] pt-2 text-left"></div>
          <div className="text-[13px] text-gray-800">Verifier name &amp; Date</div>
        </div>
      </div>

      <div className="text-xs text-gray-700 mt-2">
        Notes: 1) Use the Comments column to capture any missing evidence and recommended action. 2) If files are checked online, attach screenshots or links to the subject folder. 3) Keep a completed copy in the School office and submit a scanned copy to AQAT.
      </div>

      <div className="mt-5 text-xs text-gray-700">
        Generated for: School of Surveying — Papua New Guinea University of Technology.
      </div>
    </div>
  );
}
