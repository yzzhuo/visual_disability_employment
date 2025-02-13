import React from "react";

const data = [{
  title: 'Learn the facts about disability inclusion and create a supportive and inclusive work culture',
  reference: [
    {
      text: 'Disability as a Source of Competitive Advantage',
      link: 'https://hbr.org/2023/07/disability-as-a-source-of-competitive-advantage'
    },
    {
      text: 'Sustainable Development Goals (SDGs) And Disability',
      link: 'https://social.desa.un.org/issues/disability/sustainable-development-goals-sdgs-and-disability'
    }
  ]
}, {
  title: 'Connect job seekers with disabilities to employers who are looking for talent',
  reference: [
    {
      text: 'Looking For Talent? Find Out How To Hire Disabled Workers',
      link: 'https://www.forbes.com/sites/denisebrodey/2022/07/27/looking-for-talent-find-out-how-to-hire-disabled-workers/'
    }
  ]
}, {
  title: 'Provide more resources for fostering an inclusive workplace for employees with disabilities',
  reference: [
    {
      text: 'How to Make Workplaces More Inclusive For People with Invisible Disabilities',
      link: 'https://hbr.org/2023/04/how-to-make-workplaces-more-inclusive-for-people-with-invisible-disabilities'
    },

  ]
}]
function Suggestion() {
  return (
    <div className="w-full h-screen flex flex-col items-center space-x-2" data-aos="fade-left" >
      <h1 className="w-7/12 font-serif font-bold text-4xl text-center self-center">
        what have we done and what can we do?
      </h1>
      <div className="flex mt-12 w-10/12 justify-center ">
        <p className="">
          These insights may give us some ideas on how to improve the situation
        </p>
      </div>
      <div className="mb-24 flex-1 mt-16 flex gap-4">
        {
          data.map((item, index) => {
            return (
              <div key={item.title} className="cursor-pointer flip-card w-96 shadow-xl border-cyan-700 border-solid border-2 h-80">
                <div className="flip-card-inner">
                  <div className="flip-card-face flip-card-front font-serif flex flex-col relative bg-slate-800	">
                    <div class="flip-card-face-inner">
                      <h2 className="font absolute top-4 left-4 rounded-full bg-cyan-700 w-8 h-8 text-white flex justify-center items-center">
                        {index + 1}
                      </h2>
                      <p className="font-bold text-white">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <div className="flic-card-face flip-card-back">
                    <div class="flip-card-face-inner">
                      <ul>
                        {
                          item.reference.map((ref, index) => {
                            return (
                              <li key={index}>
                                <a className="link" href={ref.link} target="blank">{ref.text}</a>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default Suggestion;
