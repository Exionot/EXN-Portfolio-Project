from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from . import db
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')

        user = User.query.filter_by(username = username).first()
        if user:
            flash('You do exist', category='success')
            login_user(user, remember=True)
            return redirect(url_for('views.home'))
        else:
            flash('You do not exist', category='error')

    name = current_user.username if current_user.is_authenticated else "User"
    return render_template("login.html", name=name)

@auth.route('/logout')
@login_required
def logout():
    return redirect(url_for('auth.login'))

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')

        user = User.query.filter_by(username = username).first()
        if user:
            flash('That user already exists!', category='error')
        elif len(username) < 2:
            flash('Username cannot be less than 2 characters!', category='error')
        else:
            new_user = User(username=username)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('New user added!', category='success')
            return redirect(url_for('views.home'))

    return render_template("signup.html", name=current_user.username)