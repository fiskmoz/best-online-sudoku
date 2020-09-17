from flask import request, Blueprint, Response
from ..models.user import db, User
import re
from flask.helpers import url_for
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect
from email.utils import parseaddr
from random import sample
import random
import json

bp = Blueprint('generate_sudoku', __name__, url_prefix='/api/v1/generate')


@bp.route("/sudoku", methods=['GET'])
def get_sudoku():
    difficulty = request.args['difficulty']
    if not difficulty in ["easy", "medium", "hard", "extreme"]:
        return Response(
            response="Bad request",
            status=400,
            mimetype='application/text'
        )
    board = generate_sudoku(difficulty)
    return Response(
        response=json.dumps(board),
        status=200,
        mimetype='application/json'
    )


def generate_sudoku(difficulty):
    # FIRST GENERATE A COMPLETE SUDOKU RANDOMLY
    base = 3
    side = base*base
    rBase = range(base)
    rows = [g*base + r for g in shuffle(rBase) for r in shuffle(rBase)]
    cols = [g*base + c for g in shuffle(rBase) for c in shuffle(rBase)]
    nums = shuffle(range(1, base*base+1))

    # produce board using randomized baseline pattern
    board = [[nums[pattern(base, side, r, c)] for c in cols] for r in rows]
    numbers_list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    grid = [[0 for i in range(9) for j in range(9)]]

    # SECONDLY REMOVE ALL NUMBERS, REMOVE MORE OR LESS NUMBERS DEPENDING ON DIFFICULTY
    squares = side*side
    empties = {
        'easy': squares * 3//6,
        'medium': squares * 3//5,
        'hard': squares * 3//4.5,
        'extreme': squares * 3//4
    }[difficulty]
    empties = squares * 3//4
    for p in sample(range(squares), empties):
        board[p//side][p % side] = 0

    # THIRDLY RANDOMLY ROTATE TO FURTHER DECREASE CHANCES OF GETTING EXACTLY THE SAME BOARD
    if random.random() > 0.5:
        board = list(reversed(board))
    return board


def shuffle(s): return sample(s, len(s))
def pattern(base, side, r, c): return (base*(r % base)+r//base+c) % side
