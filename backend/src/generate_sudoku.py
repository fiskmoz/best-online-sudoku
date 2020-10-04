""" Endpoints for generating sudoku at different levels, also to start end end ranked sudoku """
import random
from datetime import datetime
import json

from flask import request, Blueprint, Response
from flask.helpers import make_response
from .models import User, Score, DB

BP = Blueprint('generate_sudoku', __name__, url_prefix='/api/v1/generate')


@BP.route("/sudoku", methods=['GET'])
def get_sudoku():
    """ Get basic sudoku depending on difficulty, by header"""
    difficulty = request.args['difficulty']
    if not difficulty in ["easy", "medium", "hard", "extreme"]:
        return Response(
            response="Bad request",
            status=400,
            mimetype='application/text'
        )
    board = generate_sudoku(difficulty)
    response = {}
    response["rows"] = board
    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


@BP.route("ranked/start", methods=['GET'])
def start_ranked():
    """ Start a ranked session, by body data """
    try:
        data = json.loads(request.data.decode())
    except json.JSONDecodeError:
        pass
    email = data["email"]
    jwt = data["jwt"]

    user = User.query.filter_by(email=email).first()
    response = user.decode_auth_token(jwt)
    if response["status"] != "OK":
        pass

    sudoku = generate_sudoku('extreme')

    new_score = Score(user_id=user.id, start_time=datetime.utcnow(
    ), board_data_json=json.dumps(sudoku, separators=(',', ':')))
    DB.session.add(new_score)
    DB.session.commit()
    response = {}
    response["rows"] = sudoku
    response["token"] = new_score.encode_score_token(new_score.id).decode()
    response["id"] = new_score.id
    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


@BP.route("ranked/end", methods=['POST'])
def end_ranked():
    """ End a ranked session, by body data """
    try:
        data = json.loads(request.data.decode())
    except json.JSONDecodeError:
        return make_response("Response is not json"), 400
    email = data["email"]
    jwt = data["jwt"]
    token = data["token"]
    score_id = data["id"]
    board = data["board"]

    user = User.query.filter_by(email=email).first()
    user_response = user.decode_auth_token(jwt)
    score = Score.query.filter_by(id=score_id).first()
    score_response = score.decode_score_token(token)
    if score_response["status"] != "OK" or user_response != "OK":
        return make_response("Very bad request"), 400

    old_board = json.loads(score.board_data_json)
    new_board = json.loads(board)
    if not validate_sudoku(new_board) or not compare_sudoku(old_board, new_board):
        return make_response("Not a valid grid"), 400

    score.end_time = datetime.utcnow()
    DB.session.commit()
    response = {}
    response["status"] = "Things went well! =)"
    return Response(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


def generate_sudoku(difficulty):
    """ generate a sudoku randomly fast, provided difficulty """
    # FIRST GENERATE A COMPLETE SUDOKU RANDOMLY
    base = 3
    side = base*base
    r_base = range(base)
    rows = [g*base + r for g in shuffle(r_base) for r in shuffle(r_base)]
    cols = [g*base + c for g in shuffle(r_base) for c in shuffle(r_base)]
    nums = shuffle(range(1, base*base+1))
    board = [[nums[pattern(base, side, r, c)] for c in cols] for r in rows]

    # SECONDLY REMOVE ALL NUMBERS, REMOVE MORE OR LESS NUMBERS DEPENDING ON DIFFICULTY
    squares = side*side
    empties = {
        'easy': squares * 3//8,
        'medium': squares * 3//7,
        'hard': squares * 3//6,
        'extreme': squares * 3//5
    }[difficulty]
    for pos in random.sample(range(squares), empties):
        board[pos//side][pos % side] = 0

    # THIRDLY RANDOMLY ROTATE TO FURTHER DECREASE CHANCES OF GETTING EXACTLY THE SAME BOARD
    if random.random() > 0.5:
        board = list(reversed(board))
    return board


def compare_sudoku(old, new):
    """ Compare 2 sudokus, if new is not a valid solution to the old return false """
    for row, row_index in enumerate(old):
        for cell, cell_index in enumerate(row):
            if cell != 0:
                if new[row_index][cell_index] != cell:
                    return False
    return True


def validate_sudoku(grid):
    """ Calculate if a provided sudoku is valid """
    for i in range(9):
        j, k = (i // 3) * 3, (i % 3) * 3
        if len(set(grid[i, :])) != 9 or len(set(grid[:, i])) != 9\
                or len(set(grid[j:j+3, k:k+3].ravel())) != 9:
            return False
    return True


def shuffle(side):
    """ Calculate if a provided sudoku is valid """
    return random.sample(side, len(side))


def pattern(base, side, row, col):
    """ Hej """
    return (base*(row % base)+row//base+col) % side
