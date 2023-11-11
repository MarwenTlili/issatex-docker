import React from 'react';

import { signOut, useSession } from "next-auth/react"

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image';
import ActiveLink from './ActiveLink';
import Link from 'next/link';
import { BACKEND_URL } from '../config/entrypoint';

const navigations = [
	{ name: 'Home', href: '/', isCurrent: true },
	{ name: 'Articles', href: '/articles', isCurrent: false },
	{ name: 'Manufacturing Orders', href: '/manufacturing-orders', isCurrent: false },
];

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ')
}

function Header() {
    const { data: session, status } = useSession();

	if (status === "loading") {
		return <>loading ...</>
	}

	return (
		<Disclosure as="nav" className="bg-slate-100 dark:bg-slate-800">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">

							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-inset focus:ring-white dark:bg-slate-700 dark:text-white">
								<span className="sr-only">Open main menu</span>
								{open ? (
									<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
								) : (
									<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
								)}
								</Disclosure.Button>
							</div>

							{/* left nav */}
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Image
										className="block h-8 w-auto lg:hidden"
										src="/images/tailwind-logo.png"
										width={512}
										height={306}
										alt="Your Company"
									/>
									<Image
										className="hidden h-8 w-auto lg:block"
										src="/images/tailwind-logo.png"
										width={512}
										height={306}
										alt="Your Company"
									/>
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{navigations.map((item) => (
											<ActiveLink
												key={item.name}
												href={item.href}
												className="text-base text-black hover:bg-primary-300 rounded-md px-3 py-2 font-sans dark:text-white dark:hover:bg-slate-700"
												aria-current={item.isCurrent ? 'page' : undefined}
												activeClassName="text-base bg-primary-800 text-white hover:text-white dark:bg-primary-900"
											>
												{item.name}
											</ActiveLink>
										))}
									</div>
								</div>
							</div>

							{/* right nav */}
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								{session && (
									<>
										<div className='font-sans text-base text-black hidden mr-2 md:inline dark:text-white'>
											{session.user? session.user.email : "loading ..."}
										</div>

										{/* notification element */}
										<button
											type="button"
											className="rounded-full bg-slate-300 p-1 text-black hover:text-primary-500 dark:text-white dark:bg-slate-700 dark:hover:bg-slate-500 dark:hover:text-white"
										>
											<span className="sr-only">View notifications</span>
											<BellIcon className="h-6 w-6" aria-hidden="true" />
										</button>

										{/* profile menu */}
										<Menu as="div" className="relative ml-2">
											<div>
												<Menu.Button className="flex rounded-full bg-slate-800 text-base ">
													<span className="sr-only">Open user menu</span>
                                                    <Image
                                                        className="h-10 w-auto rounded-full"
                                                        src={session.user.avatarContentUrl? `${BACKEND_URL}${session.user.avatarContentUrl}` :"/images/profile.png"}
                                                        width={128}
                                                        height={128}
                                                        alt=""
                                                    />
												</Menu.Button>
											</div>
											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
												>
												<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700">
													<Menu.Item>
														{({ active }) => (
														<a
															href="/profile"
															className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 font-sans text-base text-black dark:text-white dark:bg-slate-700 dark:hover:bg-slate-600')}
														>
															Your Profile
														</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a 
                                                                href="#"
                                                                className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 font-sans text-base text-black dark:text-white dark:bg-slate-700 dark:hover:bg-slate-600')} 
                                                            >
															Settings
														</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 font-sans text-base text-black dark:text-white dark:bg-slate-700 dark:hover:bg-slate-600')}
																onClick={ (e) => {
																	e.preventDefault;
																	signOut();	// {redirect: false, callbackUrl: ENTRYPOINT}
																} }
															>
																Sign out
															</a>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</>
								)}

								{status === "unauthenticated" && (
									<Link href="/auth/signin"
										className="text-base text-black hover:bg-primary-300 rounded-md px-3 py-2 font-sans dark:text-white dark:hover:bg-slate-700"
									>
										Sign-in
									</Link>
								)}

							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pb-3 pt-2">
							{navigations.map((item) => (
								<ActiveLink
									key={item.name}
									href={item.href}
									className="font-sans text-base text-black hover:bg-primary-300 hover:text-white  block rounded-md px-3 py-2 dark:text-white dark:hover:bg-slate-700 dark:hover:text-white"
									aria-current={item.isCurrent ? 'page' : undefined}
									activeClassName="text-base bg-primary-900 text-white"
								>
									{item.name}
								</ActiveLink>
							))}
						</div>
					</Disclosure.Panel>

				</>
			)}
		</Disclosure>
	);
}
export default Header;
