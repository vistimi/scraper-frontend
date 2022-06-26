import React from "react";
import Link from "next/link";
import Styled from "styled-components";
import { Button } from "@nextui-org/react";


interface NavButtonProps {
    children: string,
    href: string,
    title: string,
    currentPage: string
}

export const NavButton = ({children, href, title, currentPage}: NavButtonProps): JSX.Element =>
    <Link href={href}>
        <Button>{children}</Button>
    </Link>;