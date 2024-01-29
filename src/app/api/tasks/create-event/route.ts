import { connect } from "@/config/database/connection";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import Task from "@/models/task";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
