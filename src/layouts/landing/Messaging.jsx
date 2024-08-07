import React from 'react'

export default function Messaging() {
  return (
    <div>
        <div class="mt-24 flex flex-col-reverse md:flex-row items-center md:space-x-10 mx-auto max-w-screen-lg">
			<div data-aos="fade-right" class="md:w-7/12">
				<img style={{borderRadius:"20px"}} class="md:w-11/12" src="./img/msgs.png"/>
			</div>
			<div data-aos="fade-left" class="md:w-5/12 md:transform md:-translate-y-6">
				<h1 class="font-semibold text-darken text-3xl lg:pr-64">One-on-One <span class="text-teal-500">Discussions</span></h1>
				<p class="text-gray-500 my-5 lg:pr-24">Companies and Students can communicate privately through our In App Messaging feature
                so there will be smooth and clear conversation between both</p>
			</div>
		</div>
    </div>
  )
}
